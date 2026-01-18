import {
	Box,
	Button,
	Container,
	Grid,
	Group,
	Space,
	Text,
} from "@mantine/core";
import { useMemo } from "react";
import { useAdapters } from "@/shared/adapters/core/app";
import type { OptimDataSetter } from "@/shared/async-state";
import { getErrorCopy } from "@/shared/errors/domain";
import { useMutationEndGame, useMutationSendTurn } from "../../app";
import { gameService, type IGame, type WithTurns } from "../../domain";
import { GameBoardCell } from "./game-board-cell";
import { GameBoardWinModal } from "./game-board-win-modal";

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
	const hostUserId = useMemo(() => game.userIds.at(0), [game.userIds]);

	const sendTurn = useMutationSendTurn();
	const endGame = useMutationEndGame();

	const onClickQuit = () => {
		endGame.fastMutate(
			{
				userId,
				gameId: game.id,
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

		sendTurn.mutate(
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
		<>
			<Box>
				<Group align="center" justify="space-between">
					<Text fw="bold" size="xl">
						🎮 Game: {game.id.slice(0, 10)}
					</Text>
					<Button loading={endGame.isPending} onClick={onClickQuit}>
						Quit
					</Button>
				</Group>
				<Space my="md" />
				<Container size="sm">
					<Grid>
						{board.map((row, y) =>
							row.map((cell, x) => {
								const isValidMove = gameService.canApplyTurn(game, {
									playerId: userId,
									y,
									x,
								});

								return (
									<Grid.Col key={`${y}-${+x}`} span={{ base: 4 }}>
										<GameBoardCell
											disabled={sendTurn.isPending || !isValidMove}
											isValidMove={isValidMove}
											onClickCell={() => onClickCell(x, y)}
											value={
												cell === null
													? "empty"
													: cell === hostUserId
														? "p1"
														: "p2"
											}
										/>
									</Grid.Col>
								);
							}),
						)}
					</Grid>
				</Container>
			</Box>
			<GameBoardWinModal
				isBackToLobbyLoading={endGame.isPending}
				isOpen={game.status === "finished"}
				isUserWinner={game.winnerPlayerId === userId}
				onClickBackToLobby={onClickQuit}
			/>
		</>
	);
}
