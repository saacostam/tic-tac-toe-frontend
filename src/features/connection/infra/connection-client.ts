import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import type { IConnectionClient, IConnectionClientPayload } from "../domain";

export class ConnectionClient implements IConnectionClient {
	private socket: WebSocket | null = null;
	private isCleanDisconnection: boolean = false;

	close(): void {
		if (this.socket) {
			this.isCleanDisconnection = true;
			this.socket.close();
		}
	}

	join(args: IConnectionClientPayload["JoinIn"]): Promise<void> {
		return new Promise((res, rej) => {
			const socket = new WebSocket(`ws://localhost:8000/ws/${args.name}`);
			this.isCleanDisconnection = false;
			this.socket = socket;

			let settled = false;
			let opened = false;

			const cleanup = () => {
				socket.removeEventListener("open", onOpen);
				socket.removeEventListener("message", onMessage);
				socket.removeEventListener("error", onError);
				socket.removeEventListener("close", onClose);
			};

			const rejectOnce = (err: unknown) => {
				if (settled) return;
				settled = true;
				cleanup();
				rej(err);
			};

			const resolveOnce = () => {
				if (settled) return;
				settled = true;
				res();
			};

			const onOpen = () => {
				opened = true;
				resolveOnce();
			};

			const onError = (err: Event) => {
				// May or may not fire — do not rely on this
				rejectOnce(err);
			};

			const onClose = (event: CloseEvent) => {
				cleanup();

				if (!opened) {
					rejectOnce(
						new DomainError({
							type: DomainErrorType.UNKNOWN,
							msg: `[ConnectionClient.join.onClose] Closed connection without opening - code: ${event.code}`,
							userMsg: "Couldn't connect to the server. Please try again.",
						}),
					);
					return;
				}

				// Normal disconnect after a successful connection
				if (!this.isCleanDisconnection) args.onDisconnect();
			};

			const onMessage = (event: MessageEvent) => {
				if (typeof event.data !== "string") return;

				try {
					const payload = JSON.parse(event.data);
					const eventType = getStringFieldFromUnknownPayload(payload, "event");
					const message = getStringFieldFromUnknownPayload(payload, "message");

					switch (eventType) {
						case "USER_ID":
							if (message) args.onConnect(message);
							break;
						case "GAMES_CHANGED":
							args.onGamesChanged(message ?? undefined);
							break;
						case "USER_GAME_CHANGED":
							args.onUserGameChanged(message ?? undefined);
							break;
						case "USER_GAME_REMOVED":
							args.onUserGameRemoved();
							break;
					}
				} catch (err) {
					rejectOnce(err);
				}
			};

			socket.addEventListener("open", onOpen);
			socket.addEventListener("message", onMessage);
			socket.addEventListener("error", onError);
			socket.addEventListener("close", onClose);
		});
	}
}

function getStringFieldFromUnknownPayload(
	payload: unknown,
	field: string,
): string | null {
	if (typeof payload !== "object" || payload === null || !(field in payload))
		return null;
	// @ts-expect-error: we check above
	const value = payload[field];
	return typeof value === "string" ? value : null;
}
