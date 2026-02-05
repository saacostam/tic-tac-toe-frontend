import { screen, waitFor, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import { renderWithProviders } from "@/tests";
import type { IGame, IGameClientPayload } from "../domain";
import { mockGame } from "../test";
import { Game } from "./game";

function createDeps(args: { auth: boolean }) {
	const notify = vi.fn();

	const createGame = vi.fn();
	const joinGame = vi.fn();
	const queryUserGame = vi.fn();
	const queryGames = vi.fn();

	const deps = {
		adapters: {
			sessionAdapter: {
				session: args.auth
					? {
							type: "authenticated" as const,
							userId: "test-userId",
							onClear: () => {},
						}
					: {
							type: "unauthenticated" as const,
						},
			},
			notificationAdapter: {
				notify,
			},
		},
		clients: {
			gameClient: {
				createGame,
				joinGame,
				queryUserGame,
				queryGames,
			},
		},
	};

	return {
		deps,
		notify,
		createGame,
		joinGame,
		queryUserGame,
		queryGames,
	};
}

const mockError = new DomainError({
	msg: "msg error",
	userMsg: "userMsg error",
	type: DomainErrorType.UNKNOWN,
});

describe("Game [Integration]", () => {
	describe("edge-cases", () => {
		it("should handle user-game query loading state", async () => {
			const { deps, queryUserGame } = createDeps({ auth: true });
			queryUserGame.mockImplementation(() => new Promise(() => {}));

			renderWithProviders(<Game />, deps);

			await waitFor(() => {
				expect(queryUserGame).toHaveBeenCalled();
				expect(screen.getByTestId("suspense-loader")).toBeDefined();
				expect(screen.queryByTestId("query-error")).toBeNull();
			});
		});

		it("should handle user-game query error", async () => {
			const { deps, queryUserGame } = createDeps({ auth: true });
			queryUserGame.mockRejectedValueOnce(mockError);

			renderWithProviders(<Game />, deps);

			await waitFor(() => {
				expect(queryUserGame).toHaveBeenCalled();
				expect(screen.getByTestId("query-error")).toBeDefined();
			});

			// Retry
			queryUserGame.mockReset();
			queryUserGame.mockResolvedValueOnce(null);

			const retryButton = screen.getByRole("button", { name: /retry/i });
			await userEvent.click(retryButton);
			expect(queryUserGame).toHaveBeenCalledOnce();
		});

		it("should not query if unauthenticated, and keep loading state", async () => {
			const { deps, queryUserGame } = createDeps({ auth: false });

			renderWithProviders(<Game />, deps);

			await waitFor(() => {
				expect(screen.getByTestId("suspense-loader")).toBeDefined();
				expect(screen.queryByTestId("query-error")).toBeNull();
				expect(queryUserGame).not.toHaveBeenCalled();
			});
		});
	});

	describe("routing to correct view", () => {
		describe("should redirect to lobby if user doesn't have a current game", () => {
			it("handle loading state", async () => {
				const { deps, createGame, queryUserGame, queryGames } = createDeps({
					auth: true,
				});

				queryUserGame.mockResolvedValue(null);
				queryGames.mockImplementation(() => new Promise(() => {}));

				renderWithProviders(<Game />, deps);

				// Render correct view
				await waitFor(() => {
					expect(screen.getByTestId("game-lobby")).toBeDefined();
					expect(screen.queryByTestId("query-error")).toBeNull();
					expect(screen.queryByTestId("suspense-loader")).toBeDefined();
				});

				// Disable create button
				const createGameButton = screen.getByRole("button", {
					name: "Create Game",
				});
				expect(createGameButton).toBeDisabled();
				await userEvent.click(createGameButton);
				expect(createGame).not.toHaveBeenCalled();
			});

			it("handle error state", async () => {
				const { deps, createGame, queryUserGame, queryGames } = createDeps({
					auth: true,
				});

				queryUserGame.mockResolvedValue(null);
				queryGames.mockRejectedValue(mockError);

				renderWithProviders(<Game />, deps);

				await waitFor(() => {
					expect(screen.getByTestId("game-lobby")).toBeDefined();
					expect(screen.queryByTestId("suspense-loader")).toBeNull();
					expect(screen.queryByTestId("query-error")).toBeDefined();
				});

				// Allow create button click
				const createGameButton = screen.getByRole("button", {
					name: "Create Game",
				});
				expect(createGameButton).not.toBeDisabled();
				await userEvent.click(createGameButton);

				const expectedCreateGamePayload: IGameClientPayload["CreateGameReq"] = {
					userId: "test-userId",
				};
				expect(createGame).toHaveBeenCalledExactlyOnceWith(
					expectedCreateGamePayload,
				);

				// Retry
				queryGames.mockReset();
				queryGames.mockResolvedValueOnce([]);

				const retryButton = screen.getByRole("button", { name: /retry/i });
				await userEvent.click(retryButton);
				expect(queryGames).toHaveBeenCalledOnce();
			});

			it("renders empty-query if there are 0 games", async () => {
				const { deps, createGame, queryUserGame, queryGames } = createDeps({
					auth: true,
				});

				queryUserGame.mockResolvedValue(null);
				queryGames.mockResolvedValue([]);

				renderWithProviders(<Game />, deps);

				await waitFor(() => {
					expect(screen.getByTestId("game-lobby")).toBeDefined();
					expect(screen.getByTestId("game-lobby-content")).toBeDefined();
					expect(screen.queryByTestId("suspense-loader")).toBeNull();
					expect(screen.queryByTestId("query-error")).toBeNull();

					const emptyQuery = screen.getByTestId("empty-query");
					expect(emptyQuery).toBeDefined();
					expect(
						within(emptyQuery).getByText("No Rooms Available!"),
					).toBeDefined();
					expect(
						within(emptyQuery).getByText(
							"Create a room or wait for one to appear",
						),
					).toBeDefined();
				});

				// Allow create button click
				const createGameButton = screen.getByRole("button", {
					name: "Create Game",
				});
				expect(createGameButton).not.toBeDisabled();
				await userEvent.click(createGameButton);

				const expectedCreateGamePayload: IGameClientPayload["CreateGameReq"] = {
					userId: "test-userId",
				};
				expect(createGame).toHaveBeenCalledExactlyOnceWith(
					expectedCreateGamePayload,
				);
			});

			describe("Game lobby — when games exist", () => {
				const renderGameWithGames = async () => {
					const {
						deps,
						createGame,
						joinGame,
						queryUserGame,
						queryGames,
						notify,
					} = createDeps({ auth: true });

					const games: IGame[] = [
						mockGame({ id: "game-id-1", userIds: [] }),
						mockGame({ id: "game-id-2", userIds: ["test-id"] }),
					];

					queryUserGame.mockResolvedValue(null);
					queryGames.mockResolvedValue(games);

					renderWithProviders(<Game />, deps);

					await waitFor(() => {
						expect(screen.getByTestId("game-lobby")).toBeDefined();
						expect(screen.getByTestId("game-lobby-content")).toBeDefined();
					});

					return {
						createGame,
						joinGame,
						queryUserGame,
						notify,
					};
				};

				describe("rendering", () => {
					it("renders the lobby and game rooms", async () => {
						await renderGameWithGames();

						expect(screen.queryByTestId("suspense-loader")).toBeNull();
						expect(screen.queryByTestId("query-error")).toBeNull();
						expect(screen.queryByTestId("empty-query")).toBeNull();

						const rooms = screen.getAllByTestId("game-lobby-room-item");
						expect(rooms).toHaveLength(2);

						rooms.forEach((room) => {
							expect(room).toBeInstanceOf(HTMLButtonElement);
							expect(room).not.toBeDisabled();
						});
					});

					it("shows correct room metadata", async () => {
						await renderGameWithGames();

						const rooms = screen.getAllByTestId("game-lobby-room-item");

						expect(within(rooms[0]).getByText("0/2 Players")).toBeDefined();
						expect(within(rooms[0]).getByText("game-id-1")).toBeDefined();

						expect(within(rooms[1]).getByText("1/2 Players")).toBeDefined();
						expect(within(rooms[1]).getByText("game-id-2")).toBeDefined();
					});
				});

				describe("joining a game", () => {
					const joinPayload: IGameClientPayload["JoinGameReq"] = {
						gameId: "game-id-1",
						userId: "test-userId",
					};

					it("shows an error notification when join fails", async () => {
						const { joinGame, queryUserGame, notify } =
							await renderGameWithGames();

						joinGame.mockRejectedValueOnce(mockError);

						const firstRoom = screen.getAllByTestId("game-lobby-room-item")[0];

						await userEvent.click(firstRoom);

						expect(joinGame).toHaveBeenCalledExactlyOnceWith(joinPayload);

						await waitFor(() => {
							expect(queryUserGame).toHaveBeenCalledTimes(2);
							expect(notify).toHaveBeenCalledExactlyOnceWith({
								type: "error",
								msg: mockError.userMsg,
							});
						});
					});

					it("shows a success notification when join succeeds", async () => {
						const { joinGame, queryUserGame, notify } =
							await renderGameWithGames();

						const firstRoom = screen.getAllByTestId("game-lobby-room-item")[0];

						await userEvent.click(firstRoom);

						expect(joinGame).toHaveBeenCalledExactlyOnceWith(joinPayload);

						await waitFor(() => {
							expect(queryUserGame).toHaveBeenCalledTimes(2);
							expect(notify).toHaveBeenCalledExactlyOnceWith({
								type: "success",
								msg: "Game Joined!",
							});
						});
					});
				});

				describe("creating a game", () => {
					const createPayload: IGameClientPayload["CreateGameReq"] = {
						userId: "test-userId",
					};

					it("enables the create game button", async () => {
						await renderGameWithGames();

						const createGameButton = screen.getByRole("button", {
							name: "Create Game",
						});

						expect(createGameButton).not.toBeDisabled();
					});

					it("shows an error notification when create fails", async () => {
						const { createGame, queryUserGame, notify } =
							await renderGameWithGames();

						createGame.mockRejectedValueOnce(mockError);

						const createGameButton = screen.getByRole("button", {
							name: "Create Game",
						});

						await userEvent.click(createGameButton);

						expect(createGame).toHaveBeenCalledExactlyOnceWith(createPayload);

						await waitFor(() => {
							expect(queryUserGame).toHaveBeenCalledTimes(2);
							expect(notify).toHaveBeenCalledExactlyOnceWith({
								type: "error",
								msg: mockError.userMsg,
							});
						});
					});

					it("shows a success notification when create succeeds", async () => {
						const { createGame, queryUserGame, notify } =
							await renderGameWithGames();

						const createGameButton = screen.getByRole("button", {
							name: "Create Game",
						});

						await userEvent.click(createGameButton);

						expect(createGame).toHaveBeenCalledExactlyOnceWith(createPayload);

						await waitFor(() => {
							expect(queryUserGame).toHaveBeenCalledTimes(2);
							expect(notify).toHaveBeenCalledExactlyOnceWith({
								type: "success",
								msg: "Game Created!",
							});
						});
					});
				});
			});
		});
	});
});
