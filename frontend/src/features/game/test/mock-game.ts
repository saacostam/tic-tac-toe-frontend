import type { IGame } from "../domain";

export function mockGame(args: {
	id: string;
	userIds?: string[];
	status?: IGame["status"];
	winnerPlayerId?: string;
}): IGame {
	return {
		id: args.id,
		userIds: args.userIds ?? [],
		status: args.status ?? "started",
		winnerPlayerId: args.winnerPlayerId ?? null,
	};
}
