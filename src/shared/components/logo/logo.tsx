import { Flex, Text, ThemeIcon } from "@mantine/core";
import { GamepadIcon } from "@/shared/icons";

export function Logo() {
	return (
		<Flex align="center" gap="xs">
			<ThemeIcon variant="transparent" color="var(--mantine-primary-color-5)">
				<GamepadIcon />
			</ThemeIcon>
			<Text fw="bold" size="xl">
				<span style={{ color: "var(--mantine-primary-color-5)" }}>Tic</span> Tac{" "}
				<span style={{ color: "var(--mantine-primary-color-5)" }}>Toe</span>
			</Text>
		</Flex>
	);
}
