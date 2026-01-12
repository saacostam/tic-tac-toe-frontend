import type { IGame } from "./game";

export interface IGameClient {
	queryGames(): Promise<IGame[]>;
	queryUserGame(
		args: IGameClientPayload["QueryUserGameReq"],
	): Promise<IGame | null>;
}

export interface IGameClientPayload {
	QueryUserGameReq: {
		userId: string;
	};
}
