import type { IConnectionClient, IConnectionClientPayload } from "../domain";

export class ConnectionClient implements IConnectionClient {
	join(args: IConnectionClientPayload["JoinIn"]): Promise<void> {
		return new Promise((res, rej) => {
			const socket = new WebSocket(`ws://localhost:8000/ws/${args.name}`);

			const cleanup = () => {
				socket.removeEventListener("open", onOpen);
				socket.removeEventListener("message", onMessage);
				socket.removeEventListener("error", onError);
				socket.removeEventListener("close", onClose);
			};

			const onOpen = (e: Event) => {
				console.log("[ConnectionClient.join.onOpen]", e);
			};

			const onMessage = (event: MessageEvent) => {
				const unparsedPayload = event.data;
				if (typeof unparsedPayload !== "string") return;

				try {
					const payload: unknown = JSON.parse(unparsedPayload);

					const event = getStringFieldFromUnknownPayload(payload, "event");
					const message = getStringFieldFromUnknownPayload(payload, "message");

					switch (event) {
						case "USER_ID": {
							if (message) args.onConnect(message);
							break;
						}
						case "GAMES_CHANGED": {
							args.onGamesChanged();
							break;
						}
						case "USER_GAME_CHANGED": {
							args.onUserGameChanged();
							break;
						}
						case "USER_GAME_REMOVED": {
							args.onUserGameRemoved();
							break;
						}
					}
				} catch (error) {
					cleanup();
					rej(error);
				}
			};

			const onError = (err: Event) => {
				cleanup();
				rej(err);
			};

			const onClose = () => {
				cleanup();
				args.onDisconnect();
			};

			socket.addEventListener("open", onOpen);
			socket.addEventListener("message", onMessage);
			socket.addEventListener("error", onError);
			socket.addEventListener("close", onClose);

			res();
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
