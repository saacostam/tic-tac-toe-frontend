import { Button, Divider, Modal, Text } from "@mantine/core";

export interface GameBoardWinModalProps {
	isBackToLobbyLoading: boolean;
	isOpen: boolean;
	isUserWinner: boolean;
	onClickBackToLobby: () => void;
}

/**
 * Modal shown when game has reached a finished state
 */
export function GameBoardWinModal({
	isBackToLobbyLoading,
	isOpen,
	isUserWinner,
	onClickBackToLobby,
}: GameBoardWinModalProps) {
	const doNothing = () => {};

	return (
		<Modal
			centered
			opened={isOpen}
			onClose={doNothing}
			withCloseButton={false}
			title={
				<Text fw="bold" size="lg">
					{isUserWinner ? "Congratulations!" : "Better luck next time."}
				</Text>
			}
		>
			The game has ended. You can return to the lobby to view other games or
			start a new one.
			<Divider my="md" />
			<Button
				fullWidth
				onClick={onClickBackToLobby}
				loading={isBackToLobbyLoading}
			>
				Back to Lobby
			</Button>
		</Modal>
	);
}
