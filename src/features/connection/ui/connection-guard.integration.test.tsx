import { screen, waitFor } from "@testing-library/dom";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import type { ISession } from "@/shared/adapters/session/domain";
import { renderWithProviders } from "@/tests";
import { ConnectionGuard } from ".";

const navigationAdapter = new NavigationAdapter();

function setupConnectionGuard({
	pathname = "/home",
	sessionState = { type: "unauthenticated" },
}: {
	pathname?: string;
	sessionState?: ISession;
}) {
	const push = vi.fn();

	const adapters = {
		routerAdapter: {
			getPathname: () => pathname,
			push,
		},
		sessionAdapter: {
			session: sessionState,
		},
		navigationAdapter,
	};

	return { push, adapters };
}

describe("ConnectionGuard [Integration]", () => {
	it("should render children if accessing a public route and unauthenticated", () => {
		const { push, adapters } = setupConnectionGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.LANDING,
			}),
			sessionState: { type: "unauthenticated" },
		});

		renderWithProviders(
			<ConnectionGuard>
				<div data-testid="content" />
			</ConnectionGuard>,
			{ adapters },
		);

		const content = screen.getByTestId("content");
		expect(content).toBeInTheDocument();
		expect(push).not.toHaveBeenCalled();
	});

	it("should render children if accessing a private route and authenticated", () => {
		const { push, adapters } = setupConnectionGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.HOME,
			}),
			sessionState: {
				type: "authenticated",
				userId: "token",
				onClear: () => {},
			},
		});

		renderWithProviders(
			<ConnectionGuard>
				<div data-testid="content" />
			</ConnectionGuard>,
			{ adapters },
		);

		const content = screen.getByTestId("content");
		expect(content).toBeInTheDocument();
		expect(push).not.toHaveBeenCalled();
	});

	it("should redirect to landing if unauthenticated on private route", async () => {
		const { push, adapters } = setupConnectionGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.HOME,
			}),
			sessionState: { type: "unauthenticated" },
		});

		renderWithProviders(
			<ConnectionGuard>
				<div data-testid="content" />
			</ConnectionGuard>,
			{ adapters },
		);

		expect(screen.getByTestId("suspense-loader")).toBeInTheDocument();
		expect(screen.queryByTestId("content")).not.toBeInTheDocument();

		await waitFor(() => {
			expect(push).toHaveBeenCalledWith(
				navigationAdapter.generateRoute({
					name: RouteName.LANDING,
				}),
			);
		});
	});

	it("should redirect to home if authenticated and accessing public route", async () => {
		const { push, adapters } = setupConnectionGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.LANDING,
			}),
			sessionState: {
				type: "authenticated",
				userId: "token",
				onClear: () => {},
			},
		});

		renderWithProviders(
			<ConnectionGuard>
				<div data-testid="content" />
			</ConnectionGuard>,
			{ adapters },
		);

		expect(screen.getByTestId("suspense-loader")).toBeInTheDocument();
		expect(screen.queryByTestId("content")).not.toBeInTheDocument();

		await waitFor(() => {
			expect(push).toHaveBeenCalledWith(
				navigationAdapter.generateRoute({
					name: RouteName.HOME,
				}),
			);
		});
	});
});
