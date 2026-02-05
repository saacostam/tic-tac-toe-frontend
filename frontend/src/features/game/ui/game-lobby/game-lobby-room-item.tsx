import { Card, Group, Text } from "@mantine/core";
import type { IGame } from "../../domain";

export interface GameLobbyRoomItemProps {
	game: IGame;
	onClickJoinGame: (ud: string) => void;
}

export function GameLobbyRoomItem({
	game,
	onClickJoinGame,
}: GameLobbyRoomItemProps) {
	return (
		<Card
			component="button"
			type="button"
			withBorder
			style={{
				cursor: "pointer",
				width: "100%",
				textAlign: "left",
			}}
			onClick={() => onClickJoinGame(game.id)}
			aria-label={`Join game ${game.id.slice(0, 10)}`}
			data-testid="game-lobby-room-item"
		>
			<Group align="center" gap="xs">
				<div
					style={{
						borderRadius: "50%",
						backgroundColor:
							game.userIds.length < 2
								? "var(--mantine-color-yellow-5)"
								: "var(--mantine-color-green-5)",
						height: "1rem",
						width: "1rem",
					}}
				></div>
				<Text fw="bold" size="lg">
					{game.id.slice(0, 10)}
				</Text>
			</Group>
			<Text c="var(--mantine-color-dark-2)" size="sm">
				{game.userIds.length}/2 Players
			</Text>
		</Card>
	);
}
