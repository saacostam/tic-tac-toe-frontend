import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import type {
	IGame,
	IGameClient,
	IGameClientPayload,
	WithTurns,
} from "../domain";

const BASE_HTTP_URL = "http://localhost:8000";

export class GameClient implements IGameClient {
	async createGame(args: IGameClientPayload["CreateGameReq"]): Promise<void> {
		const url = new URL(`/${args.userId}/games`, BASE_HTTP_URL);

		const res = await fetch(url.toString(), { method: "POST" });

		if (!res.ok) {
			let message = "Failed to create game";

			try {
				const data = await res.json();
				if (typeof data?.message === "string") {
					message = data.message;
				}
			} catch {
				// ignore parse errors
			}

			throw new DomainError({
				userMsg: message,
				msg: message,
				type: DomainErrorType.UNKNOWN,
			});
		}
	}

	async endGame(args: IGameClientPayload["EndGameReq"]): Promise<void> {
		const url = new URL(
			`/${args.userId}/games/${args.gameId}/end`,
			BASE_HTTP_URL,
		);

		const res = await fetch(url.toString(), { method: "POST" });

		if (!res.ok) {
			let message = "Failed to end game";

			try {
				const data = await res.json();
				if (typeof data?.message === "string") {
					message = data.message;
				}
			} catch {
				// ignore parse errors
			}

			throw new DomainError({
				userMsg: message,
				msg: message,
				type: DomainErrorType.UNKNOWN,
			});
		}
	}

	async joinGame(args: IGameClientPayload["JoinGameReq"]): Promise<void> {
		const url = new URL(
			`/${args.userId}/games/${args.gameId}/join`,
			BASE_HTTP_URL,
		);

		const res = await fetch(url.toString(), { method: "POST" });

		if (!res.ok) {
			let message = "Failed to join game";

			try {
				const data = await res.json();
				if (typeof data?.message === "string") {
					message = data.message;
				}
			} catch {
				// ignore parse errors
			}

			throw new DomainError({
				userMsg: message,
				msg: message,
				type: DomainErrorType.UNKNOWN,
			});
		}
	}

	async queryGames(): Promise<IGame[]> {
		const url = new URL("/games", BASE_HTTP_URL);

		const res = await fetch(url.toString());

		if (!res.ok) {
			let message = "Failed to fetch games";

			try {
				const data = await res.json();
				if (typeof data?.message === "string") {
					message = data.message;
				}
			} catch {
				// ignore parse errors
			}

			throw new DomainError({
				userMsg: message,
				msg: message,
				type: DomainErrorType.UNKNOWN,
			});
		}

		if (res.status === 204) {
			return [];
		}

		const data: null | Array<{
			ID: string;
			Players: string[];
			Turns: [];
			Status: 0 | 1;
			WinnerPlayerId: string | null;
		}> = await res.json();

		if (data === null) {
			return [];
		}

		return data.map((entry) => ({
			id: entry.ID,
			userIds: entry.Players,
			status: entry.Status === 0 ? "started" : "finished",
			winnerPlayerId: entry.WinnerPlayerId,
		}));
	}

	async queryUserGame(
		args: IGameClientPayload["QueryUserGameReq"],
	): Promise<WithTurns<IGame> | null> {
		const url = new URL(`/${args.userId}/games`, BASE_HTTP_URL);
		const resp = await fetch(url.toString());

		if (!resp.ok) {
			let message = "Failed to fetch game";

			try {
				const data = await resp.json();
				if (typeof data?.message === "string") {
					message = data.message;
				}
			} catch {
				// ignore parse errors
			}

			throw new DomainError({
				userMsg: message,
				msg: message,
				type: DomainErrorType.UNKNOWN,
			});
		}

		// Some APIs return 204 No Content instead of null JSON
		if (resp.status === 204) {
			return null;
		}

		const data: null | {
			ID: string;
			Players: Array<string>;
			Turns:
				| null
				| {
						X: number;
						Y: number;
						PlayerId: string;
				  }[];
			Status: 0 | 1;
			WinnerPlayerId: string | null;
		} = await resp.json();

		if (data === null) return null;

		return {
			id: data.ID,
			userIds: data.Players,
			turns: (data.Turns || []).map((entry) => ({
				playerId: entry.PlayerId,
				y: entry.Y,
				x: entry.X,
			})),
			status: data.Status === 0 ? "started" : "finished",
			winnerPlayerId: data.WinnerPlayerId,
		};
	}

	async sendTurn(args: IGameClientPayload["SendTurnReq"]): Promise<void> {
		const url = new URL(
			`/${args.userId}/games/${args.gameId}/turn`,
			BASE_HTTP_URL,
		);

		const res = await fetch(url.toString(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				y: args.y,
				x: args.x,
			}),
		});

		if (!res.ok) {
			let message = "Failed to send turn";

			try {
				const data = await res.json();
				if (typeof data?.error === "string") {
					message = data.error;
				}
			} catch {
				// ignore JSON parse errors
			}

			throw new DomainError({
				userMsg: message,
				msg: message,
				type: DomainErrorType.UNKNOWN,
			});
		}
	}
}
