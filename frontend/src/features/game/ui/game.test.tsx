import { screen, waitFor } from "@testing-library/dom";
import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import { renderWithProviders } from "@/tests";
import { Game } from "./game";

describe("Game [Integration]", () => {
	describe("edge-cases", () => {
		it("should handle user-game query loading state", async () => {
			const queryUserGame = vi.fn();
			queryUserGame.mockImplementation(() => new Promise(() => {}));

			renderWithProviders(<Game />, {
				adapters: {
					sessionAdapter: {
						session: {
							type: "authenticated",
							userId: "test-userId",
							onClear: () => {},
						},
					},
				},
				clients: {
					gameClient: {
						queryUserGame,
					},
				},
			});

			await waitFor(() => {
				expect(queryUserGame).toHaveBeenCalled();
				expect(screen.getByTestId("suspense-loader")).toBeDefined();
				expect(screen.queryByTestId("query-error")).toBeNull();
			});
		});

		it("should handle user-game query error", async () => {
			const queryUserGame = vi.fn();
			queryUserGame.mockRejectedValueOnce(
				new DomainError({
					msg: "msg error",
					userMsg: "userMsg error",
					type: DomainErrorType.UNKNOWN,
				}),
			);

			renderWithProviders(<Game />, {
				adapters: {
					sessionAdapter: {
						session: {
							type: "authenticated",
							userId: "test-userId",
							onClear: () => {},
						},
					},
				},
				clients: {
					gameClient: {
						queryUserGame,
					},
				},
			});

			await waitFor(() => {
				expect(queryUserGame).toHaveBeenCalled();
				expect(screen.getByTestId("query-error")).toBeDefined();
			});
		});

		it("should not query if unauthenticated, and keep loading state", async () => {
			const queryUserGame = vi.fn();

			renderWithProviders(<Game />, {
				adapters: {
					sessionAdapter: {
						session: {
							type: "unauthenticated",
						},
					},
				},
				clients: {
					gameClient: {
						queryUserGame,
					},
				},
			});

			await waitFor(() => {
				expect(screen.getByTestId("suspense-loader")).toBeDefined();
				expect(screen.queryByTestId("query-error")).toBeNull();
				expect(queryUserGame).not.toHaveBeenCalled();
			});
		});
	});
});
