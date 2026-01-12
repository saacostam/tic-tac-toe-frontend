import { QueryKeys, useMetaQuery } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export interface UseQueryUserGameArgs {
	enabled?: boolean;
	userId: string;
}

export function useQueryUserGame({ enabled, userId }: UseQueryUserGameArgs) {
	const { gameClient } = useClients();

	return useMetaQuery({
		queryKey: [QueryKeys.USER_GAME],
		queryFn: () =>
			gameClient.queryUserGame.bind(gameClient)({
				userId,
			}),
		enabled,
	});
}
