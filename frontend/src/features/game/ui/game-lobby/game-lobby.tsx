import { Button, Card, Flex, Grid, Group, Text } from "@mantine/core";
import { useCallback } from "react";
import { useAdapters } from "@/shared/adapters/core/app";
import { EmptyQuery, QueryError, SuspenseLoader } from "@/shared/components";
import { getErrorCopy } from "@/shared/errors/domain";
import {
	useMutationCreateGame,
	useMutationJoinGame,
	useQueryGames,
} from "../../app";
import { GameLobbyRoomItem } from "./game-lobby-room-item";

export interface GameLobbyProps {
	userId: string;
}

export function GameLobby({ userId }: GameLobbyProps) {
	const { notificationAdapter } = useAdapters();

	const gamesQuery = useQueryGames();
	const games = gamesQuery.useQuery();

	const createGame = useMutationCreateGame();
	const joinGame = useMutationJoinGame();

	const onClickCreateGame = () => {
		createGame.mutate(
			{
				userId,
			},
			{
				onError: (e) => {
					notificationAdapter.notify({
						type: "error",
						msg: getErrorCopy(e, "We couldn't create the game"),
					});
				},
				onSuccess: () => {
					notificationAdapter.notify({
						type: "success",
						msg: "Game Created!",
					});
				},
			},
		);
	};

	const onClickJoinGame = useCallback(
		(gameId: string) => {
			joinGame.mutate(
				{
					gameId,
					userId,
				},
				{
					onError: (e) => {
						notificationAdapter.notify({
							type: "error",
							msg: getErrorCopy(e, "We couldn't join the game"),
						});
					},
					onSuccess: () => {
						notificationAdapter.notify({
							type: "success",
							msg: "Game Joined!",
						});
					},
				},
			);
		},
		[joinGame.mutate, notificationAdapter.notify, userId],
	);

	return (
		<Flex direction="column" gap="md" data-testid="game-lobby">
			<Group align="center" justify="space-between">
				<Text fw="bold" size="xl">
					🌐 Game Lobby
				</Text>
				<Button
					onClick={onClickCreateGame}
					loading={createGame.isPending || games.isLoading}
				>
					Create Game
				</Button>
			</Group>
			{games.isError && (
				<QueryError
					msg="We couldn&apos;t load the available games"
					retry={{ onClick: games.refetch, isPending: games.isLoading }}
				/>
			)}
			{games.isLoading && <SuspenseLoader style={{ height: "8rem" }} />}
			{games.isSuccess && (
				<main data-testid="game-lobby-content">
					{games.data.length <= 0 ? (
						<Card withBorder>
							<EmptyQuery
								title="No Rooms Available!"
								description="Create a room or wait for one to appear"
							/>
						</Card>
					) : (
						<Grid>
							{games.data.map((game) => (
								<Grid.Col key={game.id} span={{ base: 12, md: 6 }}>
									<GameLobbyRoomItem
										game={game}
										onClickJoinGame={onClickJoinGame}
									/>
								</Grid.Col>
							))}
						</Grid>
					)}
				</main>
			)}
		</Flex>
	);
}
