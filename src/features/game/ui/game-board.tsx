import {
	AspectRatio,
	Card,
	Container,
	Flex,
	Grid,
	Group,
	Text,
	ThemeIcon,
} from "@mantine/core";
import { useMemo } from "react";
import { CircleIcon, XIcon } from "@/shared/icons";
import { gameService, type IGame, type WithTurns } from "../domain";

export interface GameBoardProps {
	game: WithTurns<IGame>;
	userId: string;
}

export function GameBoard({ game, userId }: GameBoardProps) {
	const board = useMemo(
		() => gameService.createBoardFromTurns(game.turns),
		[game.turns],
	);

	return (
		<Flex direction="column" gap="md">
			<Group align="center" justify="space-between">
				<Text fw="bold" size="xl">
					🎮 Game: {game.id.slice(0, 10)}
				</Text>
			</Group>
			<Container size="sm">
				<Grid>
					{board.map((row, r) => {
						return row.map((cell, c) => (
							<Grid.Col key={`${r}-${+c}`} span={{ base: 4 }}>
								<AspectRatio ratio={1}>
									<Card withBorder>
										<Flex
											align="center"
											justify="center"
											style={{
												height: "100%",
												width: "100%",
											}}
										>
											{cell !== null ? (
												<ThemeIcon
													size="xl"
													color={cell === userId ? "blue" : "red"}
												>
													{cell === userId ? <XIcon /> : <CircleIcon />}
												</ThemeIcon>
											) : null}
										</Flex>
									</Card>
								</AspectRatio>
							</Grid.Col>
						));
					})}
				</Grid>
			</Container>
		</Flex>
	);
}
