import type { IRoom } from "./game";

export interface IGameClient {
	queryUserGame(
		args: IGameClientPayload["QueryUserGameReq"],
	): Promise<IRoom | null>;
}

export interface IGameClientPayload {
	QueryUserGameReq: {
		userId: string;
	};
}
