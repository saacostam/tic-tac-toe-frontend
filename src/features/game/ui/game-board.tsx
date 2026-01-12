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
import { useAdapters } from "@/shared/adapters/core/app";
import type { OptimDataSetter } from "@/shared/async-state";
import { getErrorCopy } from "@/shared/errors/domain";
import { CircleIcon, XIcon } from "@/shared/icons";
import { useMutationSendTurn } from "../app";
import { gameService, type IGame, type WithTurns } from "../domain";

export interface GameBoardProps {
	game: WithTurns<IGame>;
	optimSetter: OptimDataSetter<WithTurns<IGame> | null>;
	userId: string;
}

export function GameBoard({ game, optimSetter, userId }: GameBoardProps) {
	const { notificationAdapter } = useAdapters();

	const board = useMemo(
		() => gameService.createBoardFromTurns(game.turns),
		[game.turns],
	);

	const sendTurn = useMutationSendTurn();

	const onClickCell = (x: number, y: number) => {
		optimSetter((game) => {
			if (!game) return game;

			game.turns = [
				...game.turns,
				{
					playerId: userId,
					x,
					y,
				},
			];
		});

		sendTurn.fastMutate(
			{
				userId,
				gameId: game.id,
				x,
				y,
			},
			{
				onError: (e) => {
					notificationAdapter.notify({
						type: "error",
						msg: getErrorCopy(e, "We couldn't send turn"),
					});
				},
			},
		);
	};

	return (
		<Flex direction="column" gap="md">
			<Group align="center" justify="space-between">
				<Text fw="bold" size="xl">
					🎮 Game: {game.id.slice(0, 10)}
				</Text>
			</Group>
			<Container size="sm">
				<Grid>
					{board.map((row, y) => {
						return row.map((cell, x) => {
							const isValidMove = gameService.canApplyTurn(game, {
								playerId: userId,
								y,
								x,
							});

							return (
								<Grid.Col key={`${y}-${+x}`} span={{ base: 4 }}>
									<AspectRatio ratio={1}>
										<Card
											component="button"
											disabled={sendTurn.isPending || !isValidMove}
											style={{
												borderColor: isValidMove
													? "var(--mantine-color-green-5)"
													: "",
												cursor: isValidMove ? "pointer" : "",
											}}
											onClick={() => onClickCell(x, y)}
											withBorder
										>
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
							);
						});
					})}
				</Grid>
			</Container>
		</Flex>
	);
}
