import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import type { IAnalyticsEvent } from "@/shared/adapters/analytics/domain";
import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import { renderWithProviders } from "@/tests";
import { Connection } from "./connection";

describe("Connection [Integration]", () => {
	describe("Form Management", () => {
		it("name field should be required", async () => {
			const join = vi.fn();

			renderWithProviders(<Connection />, {
				adapters: {
					analyticsAdapter: {},
					sessionAdapter: {},
					navigationAdapter: {},
					notificationAdapter: {},
					routerAdapter: {},
				},
				clients: {
					connectionClient: {
						join,
					},
				},
			});

			const submit = screen.getByRole("button", { name: "Join" });
			await userEvent.click(submit);

			await waitFor(() => {
				expect(screen.getByText("Name is required")).toBeDefined();
				expect(join).not.toHaveBeenCalled();
			});
		});

		it("name field should have max value", async () => {
			const join = vi.fn();

			renderWithProviders(<Connection />, {
				adapters: {
					analyticsAdapter: {},
					sessionAdapter: {},
					navigationAdapter: {},
					notificationAdapter: {},
					routerAdapter: {},
				},
				clients: {
					connectionClient: {
						join,
					},
				},
			});

			const username = screen.getByRole("textbox", { name: "Username" });
			await userEvent.type(username, "A".repeat(49));

			const submit = screen.getByRole("button", { name: "Join" });
			await userEvent.click(submit);

			await waitFor(() => {
				expect(
					screen.getByText("Name should be less or equal to 48 characters"),
				).toBeDefined();
				expect(join).not.toHaveBeenCalled();
			});
		});
	});

	describe("Error Management", () => {
		it("handle errors", async () => {
			const join = vi.fn();
			const trackEvent = vi.fn();

			renderWithProviders(<Connection />, {
				adapters: {
					analyticsAdapter: {
						trackEvent,
					},
					sessionAdapter: {},
					navigationAdapter: {},
					notificationAdapter: {},
					routerAdapter: {},
				},
				clients: {
					connectionClient: {
						join,
					},
				},
			});

			const username = screen.getByRole("textbox", { name: "Username" });
			await userEvent.type(username, "A".repeat(1));

			join.mockRejectedValue(
				new DomainError({
					type: DomainErrorType.BAD_REQUEST,
					userMsg: "Test Error Copy",
					msg: "Test Error",
				}),
			);

			const submit = screen.getByRole("button", { name: "Join" });
			userEvent.click(submit);

			await waitFor(() => {
				expect(join).toHaveBeenCalled();
				expect(screen.getByText("Test Error Copy")).toBeDefined();
				const event: IAnalyticsEvent = {
					name: "join",
					payload: {
						success: false,
					},
				};
				expect(trackEvent).toHaveBeenCalledWith(event);
			});
		});
	});
});
