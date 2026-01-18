import { useQueryClient } from "@tanstack/react-query";
import { MutationKeys, QueryKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutationEndGame() {
	const queryClient = useQueryClient();

	const { gameClient } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.END_GAME],
		mutationFn: gameClient.endGame.bind(gameClient),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.AVAILABLE_ROOMS],
			});

			queryClient.invalidateQueries({
				queryKey: [QueryKeys.USER_GAME],
			});
		},
	});
}
