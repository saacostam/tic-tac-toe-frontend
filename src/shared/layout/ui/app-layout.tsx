import {
	AppShell,
	Burger,
	Button,
	Container,
	Flex,
	Group,
	UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type PropsWithChildren, useCallback, useMemo } from "react";
import { ThemeToggle } from "@/features/theme/ui";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { Link } from "@/shared/adapters/navigation/ui";
import { Logo } from "@/shared/components";

const MAIN_LINKS: {
	name: RouteName;
	label: string;
}[] = [] as const;

export function AppLayout({ children }: PropsWithChildren) {
	const { sessionAdapter, navigationAdapter } = useAdapters();

	const [opened, { toggle }] = useDisclosure();

	const links = useMemo(
		() =>
			MAIN_LINKS.map(({ name, label }) => ({
				href: navigationAdapter.generateRoute({
					name,
				}),
				label,
			})),
		[navigationAdapter.generateRoute],
	);

	const onClickRename = useCallback(
		() => sessionAdapter.removeToken(),
		[sessionAdapter.removeToken],
	);

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { desktop: true, mobile: !opened },
			}}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<Group justify="space-between" style={{ flex: 1 }}>
						<UnstyledButton
							component={Link}
							to={navigationAdapter.generateRoute({
								name: RouteName.HOME,
							})}
						>
							<Logo />
						</UnstyledButton>
						<Flex gap="lg">
							<Group gap="lg" visibleFrom="sm">
								{links.map(({ href, label }) => (
									<UnstyledButton component={Link} key={href} to={href}>
										{label}
									</UnstyledButton>
								))}
							</Group>
							<Button onClick={onClickRename}>Rename</Button>
							<ThemeToggle />
						</Flex>
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Navbar py="md" px="lg">
				{links.map(({ href, label }) => (
					<UnstyledButton component={Link} key={href} to={href}>
						{label}
					</UnstyledButton>
				))}
			</AppShell.Navbar>

			<AppShell.Main>
				<Container mx="auto">{children}</Container>
			</AppShell.Main>
		</AppShell>
	);
}
