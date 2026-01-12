export interface IGame {
	id: string;
	userIds: Array<string>;
}

export interface ITurn {
	playerId: string;
	x: number;
	y: number;
}

export type WithTurns<Game> = Game & {
	turns: ITurn[];
};
