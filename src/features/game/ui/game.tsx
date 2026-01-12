import { useAdapters } from "@/shared/adapters/core/app";
import { QueryError, SuspenseLoader } from "@/shared/components";
import { useQueryUserGame } from "../app";
import { GameLobby } from "./game-lobby";

export function Game() {
	const { authAdapter } = useAdapters();

	const userGameQuery = useQueryUserGame({
		userId:
			(authAdapter.session.type === "authenticated" &&
				authAdapter.session.userId) ||
			"",
		enabled:
			authAdapter.session.type === "authenticated" &&
			!!authAdapter.session.userId,
	});
	const userGame = userGameQuery.useQuery();

	if (userGame.isError)
		return (
			<QueryError
				msg="Unnable to retrive user game information"
				retry={{ onClick: userGame.refetch, isPending: userGame.isLoading }}
			/>
		);
	if (userGame.isSuccess) return userGame.data === null ? <GameLobby /> : null;

	return <SuspenseLoader style={{ height: "32rem" }} />;
}
