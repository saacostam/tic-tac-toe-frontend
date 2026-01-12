import { Card, Flex, Loader, Text, Title } from "@mantine/core";
import type { IGame } from "../domain";

export interface WaitingForPlayerProps {
	game: IGame;
}

export function WaitingForPlayer({ game }: WaitingForPlayerProps) {
	return (
		<Card withBorder>
			<Flex align="center" direction="column">
				<Loader type="dots" size="xl" />
				<Title order={4} size="lg" mb={4}>
					Waiting for Players! ({game.userIds.length}/2)
				</Title>
				<Text c="var(--mantine-color-dark-2)" size="sm">
					The game will start once all players have joined.
				</Text>
			</Flex>
		</Card>
	);
}
