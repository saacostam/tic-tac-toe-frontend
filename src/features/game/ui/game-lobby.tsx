import { Card, Flex, Grid, Text } from "@mantine/core";
import { EmptyQuery, QueryError, SuspenseLoader } from "@/shared/components";
import { useQueryGames } from "../app";

export function GameLobby() {
	const gamesQuery = useQueryGames();
	const games = gamesQuery.useQuery();

	return (
		<Flex direction="column" gap="md">
			<Text fw="bold" size="xl">
				🌐 Game Lobby
			</Text>
			{games.isError && (
				<QueryError
					msg="We couldn&apos;t load the available games"
					retry={{ onClick: games.refetch, isPending: games.isLoading }}
				/>
			)}
			{games.isLoading && <SuspenseLoader style={{ height: "8rem" }} />}
			{games.isSuccess && (
				<Card withBorder>
					{games.data.length <= 0 ? (
						<EmptyQuery
							title="No Rooms Available!"
							description="Create a room or wait for one to appear"
						/>
					) : (
						<Grid>
							{games.data.map((room) => (
								<Grid.Col key={room.id} span={{ base: 12, md: 6 }}>
									<Card withBorder w="full">
										<Text fw="bold" size="lg">
											{room.id.slice(0, 10)}
										</Text>
										<Text size="sm">{room.userIds.length}/2 Players</Text>
									</Card>
								</Grid.Col>
							))}
						</Grid>
					)}
				</Card>
			)}
		</Flex>
	);
}
