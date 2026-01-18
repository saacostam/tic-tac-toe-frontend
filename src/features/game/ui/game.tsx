import { useAdapters } from "@/shared/adapters/core/app";
import { QueryError, SuspenseLoader } from "@/shared/components";
import { useQueryUserGame } from "../app";
import { GameBoard } from "./game-board";
import { GameLobby } from "./game-lobby";
import { WaitingForPlayer } from "./waiting-for-player";

const TOTAL_PLAYERS = 2;

export function Game() {
	const { sessionAdapter } = useAdapters();

	const userGameQuery = useQueryUserGame({
		userId:
			(sessionAdapter.session.type === "authenticated" &&
				sessionAdapter.session.userId) ||
			"",
		enabled:
			sessionAdapter.session.type === "authenticated" &&
			!!sessionAdapter.session.userId,
	});
	const userGame = userGameQuery.useQuery();

	if (userGame.isError)
		return (
			<QueryError
				msg="Unnable to retrive user game information"
				retry={{ onClick: userGame.refetch, isPending: userGame.isLoading }}
			/>
		);
	if (userGame.isSuccess && sessionAdapter.session.type === "authenticated")
		return userGame.data === null ? (
			<GameLobby userId={sessionAdapter.session.userId} />
		) : userGame.data.userIds.length < TOTAL_PLAYERS &&
			userGame.data.status === "started" ? (
			<WaitingForPlayer
				game={userGame.data}
				userId={sessionAdapter.session.userId}
			/>
		) : (
			<GameBoard
				game={userGame.data}
				optimSetter={userGameQuery.setOptimisticData}
				userId={sessionAdapter.session.userId}
			/>
		);

	return <SuspenseLoader style={{ height: "32rem" }} />;
}
