import { useAdapters } from "@/shared/adapters/core/app";
import { QueryError, SuspenseLoader } from "@/shared/components";
import { useQueryUserGame } from "../app";
import { GameBoard } from "./game-board";
import { GameLobby } from "./game-lobby";
import { WaitingForPlayer } from "./waiting-for-player";

const TOTAL_PLAYERS = 2;

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
	if (userGame.isSuccess && authAdapter.session.type === "authenticated")
		return userGame.data === null ? (
			<GameLobby userId={authAdapter.session.userId} />
		) : userGame.data.userIds.length < TOTAL_PLAYERS ? (
			<WaitingForPlayer game={userGame.data} />
		) : (
			<GameBoard game={userGame.data} userId={authAdapter.session.userId} />
		);

	return <SuspenseLoader style={{ height: "32rem" }} />;
}
