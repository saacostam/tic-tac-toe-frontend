import { type PropsWithChildren, useMemo } from "react";
import { HashRouter } from "react-router";
import { useMockAnalyticsProvider } from "@/shared/adapters/analytics/infra";
import { useAuthAdapter } from "@/shared/adapters/auth/infra";
import { AuthProvider } from "@/shared/adapters/auth/ui";
import { useMockErrorMonitoringAdapter } from "@/shared/adapters/error-monitoring/infra";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { NavigationProvider } from "@/shared/adapters/navigation/ui";
import { useNotificationAdapter } from "@/shared/adapters/notification/infra";
import { useLocalStoragePersistenceAdapter } from "@/shared/adapters/persistence/infra";
import { useReactRouterAdapter } from "@/shared/adapters/router/infra";
import { useThemeAdapterImpl } from "@/shared/adapters/theme/infra";
import { useUuidAdapter } from "@/shared/adapters/uuid/infra";
import { AdaptersContext } from "../app";
import type { IAdapters } from "../domain";

/**
 * Provider component to supply application adapters to the component tree.
 *
 * This component wraps its children with the necessary context provider (`AdaptersContext.Provider`)
 * to make adapters available throughout the app.
 *
 * @param {PropsWithChildren} props - The props object containing the children to be rendered.
 *
 * @returns {JSX.Element} A context provider wrapping the children with available adapters.
 */
export function AdaptersProvider({ children }: PropsWithChildren) {
	return (
		<AdaptersProviderWrapper>
			<AdaptersProviderDependencyInjection>
				<NavigationProvider>
					<AuthProvider>{children}</AuthProvider>
				</NavigationProvider>
			</AdaptersProviderDependencyInjection>
		</AdaptersProviderWrapper>
	);
}

// Static Instances
const navigationAdapter = new NavigationAdapter();

/**
 * Dependency injection wrapper that initializes and provides the necessary adapters.
 *
 * This component creates the adapters (e.g., persistence adapter) and supplies them through the
 * `AdaptersContext.Provider`.
 *
 * @param {PropsWithChildren} props - The props object containing the children to be rendered.
 *
 * @returns {JSX.Element} A context provider that wraps the children with injected adapters.
 */
function AdaptersProviderDependencyInjection({ children }: PropsWithChildren) {
	const persistenceAdapter = useLocalStoragePersistenceAdapter();
	const uuidAdapter = useUuidAdapter();

	const analyticsAdapter = useMockAnalyticsProvider();
	const authAdapter = useAuthAdapter();
	const errorMonitoringAdapter = useMockErrorMonitoringAdapter();
	const notificationAdapter = useNotificationAdapter({
		uuidAdapter,
	});
	const routerAdapter = useReactRouterAdapter();
	const themeAdapter = useThemeAdapterImpl({
		persistenceAdapter,
	});

	const adapters: IAdapters = useMemo(
		() => ({
			analyticsAdapter,
			authAdapter,
			errorMonitoringAdapter,
			navigationAdapter,
			notificationAdapter,
			persistenceAdapter,
			routerAdapter,
			themeAdapter,
			uuidAdapter,
		}),
		[
			analyticsAdapter,
			authAdapter,
			errorMonitoringAdapter,
			notificationAdapter,
			persistenceAdapter,
			routerAdapter,
			themeAdapter,
			uuidAdapter,
		],
	);

	return (
		<AdaptersContext.Provider value={adapters}>
			{children}
		</AdaptersContext.Provider>
	);
}

/**
 * A wrapper component responsible for injecting additional library providers
 * or external components around the application.
 *
 * This allows adding necessary libraries or providers that need to be globally available
 * across the app while maintaining the structure and modularity of the component tree.
 *
 * @param {PropsWithChildren} props - The props object containing the children to be rendered.
 *
 * @returns {JSX.Element} The children wrapped with any additional providers or components.
 */
function AdaptersProviderWrapper({ children }: PropsWithChildren) {
	return <HashRouter>{children}</HashRouter>;
}
