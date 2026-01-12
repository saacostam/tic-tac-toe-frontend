import { Flex, Text, ThemeIcon, Title } from "@mantine/core";
import { CubeTransparentIcon } from "@/shared/icons";

export interface EmptyQueryProps {
	title?: string;
	description?: string;
}

export function EmptyQuery({
	title = "Nothing Here!",
	description = "Once something is available, it will be visible here",
}: EmptyQueryProps) {
	return (
		<Flex align="center" direction="column">
			<ThemeIcon variant="light" size="xl" mb="sm">
				<CubeTransparentIcon />
			</ThemeIcon>
			<Title order={4} size="lg" mb={4}>
				{title}
			</Title>
			<Text c="var(--mantine-color-dark-2)" size="sm">
				{description}
			</Text>
		</Flex>
	);
}
