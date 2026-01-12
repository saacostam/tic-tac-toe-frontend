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
		await fetch(url.toString(), { method: "POST" });
	}

	async joinGame(args: IGameClientPayload["JoinGameReq"]): Promise<void> {
		const url = new URL(
			`/${args.userId}/games/${args.gameId}/join`,
			BASE_HTTP_URL,
		);
		await fetch(url.toString(), { method: "POST" });
	}

	async queryGames(): Promise<IGame[]> {
		const url = new URL("/games", BASE_HTTP_URL);
		const resp = await fetch(url.toString());
		const data: null | Array<{
			ID: string;
			Players: Array<string>;
			Turns: [];
		}> = await resp.json();

		if (data === null) return [];

		return data.map((entry) => ({
			id: entry.ID,
			userIds: entry.Players,
		}));
	}

	async queryUserGame(
		args: IGameClientPayload["QueryUserGameReq"],
	): Promise<WithTurns<IGame> | null> {
		const url = new URL(`/${args.userId}/games`, BASE_HTTP_URL);
		const resp = await fetch(url.toString());

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
		};
	}
}
