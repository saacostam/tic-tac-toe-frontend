import type { IGameClient, IGameClientPayload, IRoom } from "../domain";

const BASE_HTTP_URL = "http://localhost:8000";

export class GameClient implements IGameClient {
	async queryUserGame(
		args: IGameClientPayload["QueryUserGameReq"],
	): Promise<IRoom | null> {
		const url = new URL(`/${args.userId}/games`, BASE_HTTP_URL);
		const resp = await fetch(url.toString());

		const data: null | {
			ID: string;
			Players: Array<string>;
			Turns: [];
		} = await resp.json();

		if (data === null) return null;

		return {
			id: data.ID,
			userIds: data.Players,
		};
	}
}
