import type { IGame, ITurn, WithTurns } from "./game";

type IBoardStatus = null | string;

type IBoard = [
	[IBoardStatus, IBoardStatus, IBoardStatus],
	[IBoardStatus, IBoardStatus, IBoardStatus],
	[IBoardStatus, IBoardStatus, IBoardStatus],
];

class GameService {
	canApplyTurn(game: WithTurns<IGame>, turn: ITurn): boolean {
		const board = this.createBoardFromTurns(game.turns);
		return board.at(turn.y)?.at(turn.x) === null;
	}

	checkWinCondition(
		game: WithTurns<IGame>,
		args: {
			player1UserId: string;
			player2UserId: string;
		},
	):
		| {
				hasWin: true;
				winnerUserId: string;
		  }
		| {
				hasWin: false;
		  } {
		const board = this.createBoardFromTurns(game.turns);

		if (this.checkWinConditionForUserId(board, args.player1UserId)) {
			return {
				hasWin: true,
				winnerUserId: args.player1UserId,
			};
		}

		if (this.checkWinConditionForUserId(board, args.player2UserId)) {
			return {
				hasWin: true,
				winnerUserId: args.player2UserId,
			};
		}

		return {
			hasWin: false,
		};
	}

	createBoardFromTurns(turns: ITurn[]): IBoard {
		const board = this.createEmptyBoard();

		turns.forEach((turn) => {
			const cell = board.at(turn.y)?.at(turn.x);

			if (cell === null) {
				board[turn.y][turn.x] = turn.playerId;
			}
		});

		return board;
	}

	private checkWinConditionForUserId(board: IBoard, playerId: string): boolean {
		const horizontal = [0, 1, 2].some((rowIndex) => {
			const row = board[rowIndex];
			return row[0] === playerId && row[1] === playerId && row[2] === playerId;
		});

		const vertical = [0, 1, 2].some((colIndex) => {
			return (
				board[0][colIndex] === playerId &&
				board[1][colIndex] === playerId &&
				board[2][colIndex] === playerId
			);
		});

		const diag1 =
			board[0][0] === playerId &&
			board[1][1] === playerId &&
			board[2][2] === playerId;

		const diag2 =
			board[0][2] === playerId &&
			board[1][1] === playerId &&
			board[2][0] === playerId;

		return horizontal || vertical || diag1 || diag2;
	}

	private createEmptyBoard(): IBoard {
		return [
			[null, null, null],
			[null, null, null],
			[null, null, null],
		];
	}
}

export const gameService = new GameService();
