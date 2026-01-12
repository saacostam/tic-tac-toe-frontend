import { QueryKeys, useMetaQuery } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useQueryGames() {
	const { gameClient } = useClients();

	return useMetaQuery({
		queryKey: [QueryKeys.AVAILABLE_ROOMS],
		queryFn: gameClient.queryGames.bind(gameClient),
	});
}
