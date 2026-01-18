import { describe, expect, it } from "vitest";
import type { IGame, ITurn, WithTurns } from "./game";
import { gameService } from "./game-service";

const createGame = (turns: ITurn[]): WithTurns<IGame> => ({
	id: "game-1",
	userIds: ["p1", "p2"],
	turns,
	status: "started",
	winnerPlayerId: null,
});

describe("gameService", () => {
	describe("canApplyTurn", () => {
		it("returns true when the cell is empty", () => {
			const game = createGame([{ x: 0, y: 0, playerId: "p1" }]);

			const turn: ITurn = { x: 1, y: 1, playerId: "p2" };

			expect(gameService.canApplyTurn(game, turn)).toBe(true);
		});

		it("returns false when the cell is already occupied", () => {
			const game = createGame([{ x: 1, y: 1, playerId: "p1" }]);

			const turn: ITurn = { x: 1, y: 1, playerId: "p2" };

			expect(gameService.canApplyTurn(game, turn)).toBe(false);
		});
	});

	describe("checkWinCondition", () => {
		const players = {
			player1UserId: "p1",
			player2UserId: "p2",
		};

		it("detects a horizontal win", () => {
			const game = createGame([
				{ x: 0, y: 0, playerId: "p1" },
				{ x: 1, y: 0, playerId: "p1" },
				{ x: 2, y: 0, playerId: "p1" },
			]);

			const result = gameService.checkWinCondition(game, players);

			expect(result).toEqual({
				hasWin: true,
				winnerUserId: "p1",
			});
		});

		it("detects a vertical win", () => {
			const game = createGame([
				{ x: 1, y: 0, playerId: "p2" },
				{ x: 1, y: 1, playerId: "p2" },
				{ x: 1, y: 2, playerId: "p2" },
			]);

			const result = gameService.checkWinCondition(game, players);

			expect(result).toEqual({
				hasWin: true,
				winnerUserId: "p2",
			});
		});

		it("detects a diagonal win (top-left to bottom-right)", () => {
			const game = createGame([
				{ x: 0, y: 0, playerId: "p1" },
				{ x: 1, y: 1, playerId: "p1" },
				{ x: 2, y: 2, playerId: "p1" },
			]);

			const result = gameService.checkWinCondition(game, players);

			expect(result).toEqual({
				hasWin: true,
				winnerUserId: "p1",
			});
		});

		it("detects a diagonal win (top-right to bottom-left)", () => {
			const game = createGame([
				{ x: 2, y: 0, playerId: "p2" },
				{ x: 1, y: 1, playerId: "p2" },
				{ x: 0, y: 2, playerId: "p2" },
			]);

			const result = gameService.checkWinCondition(game, players);

			expect(result).toEqual({
				hasWin: true,
				winnerUserId: "p2",
			});
		});

		it("returns hasWin=false when no player has won", () => {
			const game = createGame([
				{ x: 0, y: 0, playerId: "p1" },
				{ x: 1, y: 0, playerId: "p2" },
				{ x: 2, y: 0, playerId: "p1" },
				{ x: 0, y: 1, playerId: "p2" },
			]);

			const result = gameService.checkWinCondition(game, players);

			expect(result).toEqual({ hasWin: false });
		});
	});

	describe("createBoardFromTurns", () => {
		it("creates an empty board when there are no turns", () => {
			const board = gameService.createBoardFromTurns([]);

			expect(board).toEqual([
				[null, null, null],
				[null, null, null],
				[null, null, null],
			]);
		});

		it("places turns in the correct coordinates", () => {
			const board = gameService.createBoardFromTurns([
				{ x: 0, y: 0, playerId: "p1" },
				{ x: 2, y: 1, playerId: "p2" },
				{ x: 1, y: 2, playerId: "p1" },
			]);

			expect(board).toEqual([
				["p1", null, null],
				[null, null, "p2"],
				[null, "p1", null],
			]);
		});

		it("leaves untouched cells as null", () => {
			const board = gameService.createBoardFromTurns([
				{ x: 1, y: 1, playerId: "p1" },
			]);

			expect(board[0][0]).toBeNull();
			expect(board[0][2]).toBeNull();
			expect(board[2][2]).toBeNull();
		});

		it("does not overwrite an already occupied cell", () => {
			const board = gameService.createBoardFromTurns([
				{ x: 1, y: 1, playerId: "p1" },
				{ x: 1, y: 1, playerId: "p2" }, // should be ignored
			]);

			expect(board[1][1]).toBe("p1");
		});

		it("always returns a 3x3 board", () => {
			const board = gameService.createBoardFromTurns([
				{ x: 0, y: 0, playerId: "p1" },
			]);

			expect(board).toHaveLength(3);
			board.forEach((row) => {
				expect(row).toHaveLength(3);
			});
		});
	});
});
