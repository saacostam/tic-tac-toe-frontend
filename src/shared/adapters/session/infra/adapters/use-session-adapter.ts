import { useCallback, useMemo, useState } from "react";
import type { ISession, ISessionAdapter } from "../../domain";

export const useSessionAdapter = (): ISessionAdapter => {
	const [session, setSession] = useState<ISession>({
		type: "unauthenticated",
	});

	const removeToken = useCallback(() => {
		setSession((value) => {
			if (value.type === "authenticated") value.onClear();

			return {
				type: "unauthenticated",
			};
		});
	}, []);

	const setToken = useCallback((userId: string, onClear: () => void) => {
		setSession({
			type: "authenticated",
			userId: userId,
			onClear,
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
