import {
	Button,
	Card,
	Flex,
	Group,
	Loader,
	Space,
	Text,
	Title,
} from "@mantine/core";
import { useAdapters } from "@/shared/adapters/core/app";
import { getErrorCopy } from "@/shared/errors/domain";
import { useMutationEndGame } from "../app";
import type { IGame } from "../domain";

export interface WaitingForPlayerProps {
	game: IGame;
	userId: string;
}

export function WaitingForPlayer({ game, userId }: WaitingForPlayerProps) {
	const { notificationAdapter } = useAdapters();

	const endGame = useMutationEndGame();

	const onClickQuit = () => {
		endGame.fastMutate(
			{
				gameId: game.id,
				userId,
			},
			{
				onError: (e) => {
					notificationAdapter.notify({
						type: "error",
						msg: getErrorCopy(e, "We couldn't quit."),
					});
				},
			},
		);
	};

	return (
		<>
			<Group align="center" justify="space-between">
				<Text fw="bold" size="xl">
					🎮 Game: {game.id.slice(0, 10)}
				</Text>
				<Button loading={endGame.isPending} onClick={onClickQuit}>
					Quit
				</Button>
			</Group>
			<Space my="md" />
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
		</>
	);
}
