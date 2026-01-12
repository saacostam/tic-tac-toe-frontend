import { MutationKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutationJoin() {
	const { connectionClient } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.JOIN],
		mutationFn: connectionClient.join.bind(connectionClient),
	});
}
