import { useEffect, useMemo } from "react";
import { PUBLIC_ROUTES } from "@/shared/adapters/auth/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";

export function useConnectionGuard() {
	const { sessionAdapter, routerAdapter, navigationAdapter } = useAdapters();
	const { session } = sessionAdapter;

	const publicRoutesPaths = useMemo(
		() =>
			PUBLIC_ROUTES.map((route) =>
				navigationAdapter.generateRoute({ name: route }),
			),
		[navigationAdapter],
	);

	const location = routerAdapter.getPathname();
	const isPublicRoute = publicRoutesPaths.some(
		(publicRoute) => location === publicRoute,
	);

	const shouldGoToApp = session.type === "authenticated" && isPublicRoute;
	const shouldGoToLanding =
		session.type === "unauthenticated" && !isPublicRoute;

	useEffect(() => {
		if (shouldGoToApp) {
			routerAdapter.push(
				navigationAdapter.generateRoute({ name: RouteName.HOME }),
			);
		}
	}, [routerAdapter, navigationAdapter, shouldGoToApp]);

	useEffect(() => {
		if (shouldGoToLanding) {
			routerAdapter.push(
				navigationAdapter.generateRoute({ name: RouteName.LANDING }),
			);
		}
	}, [routerAdapter, navigationAdapter, shouldGoToLanding]);

	const pending = shouldGoToApp || shouldGoToLanding;

	return useMemo(() => (pending ? "loading" : "success"), [pending]);
}
