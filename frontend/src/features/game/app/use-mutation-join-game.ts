import { useQueryClient } from "@tanstack/react-query";
import { MutationKeys, QueryKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IGameClientPayload } from "../domain";

export function useMutationJoinGame() {
	const queryClient = useQueryClient();

	const { gameClient } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.JOIN_GAME],
		mutationFn: (args: IGameClientPayload["JoinGameReq"]) =>
			gameClient.joinGame(args),
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
