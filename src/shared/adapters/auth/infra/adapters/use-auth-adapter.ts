import { useCallback, useMemo, useState } from "react";
import type { IAuthAdapter, ISession } from "../../domain";

export const useAuthAdapter = (): IAuthAdapter => {
	const [session, setSession] = useState<ISession>({
		type: "unauthenticated",
	});

	const removeToken = useCallback(() => {
		setSession({
			type: "unauthenticated",
		});
	}, []);

	const setToken = useCallback((userId: string) => {
		setSession({
			type: "authenticated",
			userId: userId,
		});
	}, []);

	return useMemo(
		() => ({
			removeToken,
			session,
			setToken,
		}),
		[removeToken, session, setToken],
	);
};
