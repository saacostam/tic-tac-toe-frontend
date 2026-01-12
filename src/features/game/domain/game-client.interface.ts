import type { IGame, WithTurns } from "./game";

export interface IGameClient {
	createGame(args: IGameClientPayload["CreateGameReq"]): Promise<void>;
	joinGame(args: IGameClientPayload["JoinGameReq"]): Promise<void>;
	queryGames(): Promise<IGame[]>;
	queryUserGame(
		args: IGameClientPayload["QueryUserGameReq"],
	): Promise<WithTurns<IGame> | null>;
}

export interface IGameClientPayload {
	CreateGameReq: {
		userId: string;
	};
	JoinGameReq: {
		gameId: string;
		userId: string;
	};
	QueryUserGameReq: {
		userId: string;
	};
}
