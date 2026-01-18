import type { IGame, WithTurns } from "./game";

export interface IGameClient {
	createGame(args: IGameClientPayload["CreateGameReq"]): Promise<void>;
	endGame(args: IGameClientPayload["EndGameReq"]): Promise<void>;
	joinGame(args: IGameClientPayload["JoinGameReq"]): Promise<void>;
	queryGames(): Promise<IGame[]>;
	queryUserGame(
		args: IGameClientPayload["QueryUserGameReq"],
	): Promise<WithTurns<IGame> | null>;
	sendTurn(args: IGameClientPayload["SendTurnReq"]): Promise<void>;
}

export interface IGameClientPayload {
	CreateGameReq: {
		userId: string;
	};
	EndGameReq: {
		gameId: string;
		userId: string;
	};
	JoinGameReq: {
		gameId: string;
		userId: string;
	};
	QueryUserGameReq: {
		userId: string;
	};
	SendTurnReq: {
		userId: string;
		gameId: string;
		x: number;
		y: number;
	};
}
