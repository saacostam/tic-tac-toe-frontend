export interface IGame {
	id: string;
	userIds: Array<string>;
	status: "started" | "finished";
	winnerPlayerId: string | null;
}

export interface ITurn {
	playerId: string;
	x: number;
	y: number;
}

export type WithTurns<Game> = Game & {
	turns: ITurn[];
};
