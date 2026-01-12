import { screen, waitFor } from "@testing-library/dom";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { renderWithProviders } from "@/tests";
import type { ISession } from "./domain";
import { AuthGuard } from "./ui";

const navigationAdapter = new NavigationAdapter();

function setupAuthGuard({
	pathname = "/home",
	authState = { type: "unauthenticated" },
}: {
	pathname?: string;
	authState?: ISession;
	authError?: Error;
}) {
	const push = vi.fn();

	const adapters = {
		routerAdapter: {
			getPathname: () => pathname,
			push,
		},
		authAdapter: {
			session: authState,
		},
		navigationAdapter,
	};

	return { push, adapters };
}

describe("AuthGuard [Integration]", () => {
	it("should render children if accessing a public route and unauthenticated", () => {
		const { push, adapters } = setupAuthGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.LANDING,
			}),
			authState: { type: "unauthenticated" },
		});

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{ adapters },
		);

		const content = screen.getByTestId("content");
		expect(content).toBeInTheDocument();
		expect(push).not.toHaveBeenCalled();
	});

	it("should render children if accessing a private route and authenticated", () => {
		const { push, adapters } = setupAuthGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.HOME,
			}),
			authState: { type: "authenticated", userId: "token" },
		});

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{ adapters },
		);

		const content = screen.getByTestId("content");
		expect(content).toBeInTheDocument();
		expect(push).not.toHaveBeenCalled();
	});

	it("should redirect to landing if unauthenticated on private route", async () => {
		const { push, adapters } = setupAuthGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.HOME,
			}),
			authState: { type: "unauthenticated" },
		});

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
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

	it("should redirect to home if authenticated and accessing auth route", async () => {
		const { push, adapters } = setupAuthGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.LANDING,
			}),
			authState: { type: "authenticated", userId: "token" },
		});

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
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
