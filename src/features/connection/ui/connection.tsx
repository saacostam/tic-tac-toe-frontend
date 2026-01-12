import { zodResolver } from "@hookform/resolvers/zod";
import {
	Alert,
	Box,
	Button,
	Card,
	Space,
	Text,
	TextInput,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { QueryKeys } from "@/shared/async-state";
import { FormUtils } from "@/shared/utils/form";
import { useMutationJoin } from "../app";

const connectionSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(48, "Name should be less or equal to 48 characters"),
});

export function Connection() {
	const { authAdapter, navigationAdapter, notificationAdapter, routerAdapter } =
		useAdapters();

	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			name: "",
		},
		resolver: zodResolver(connectionSchema),
	});

	const join = useMutationJoin();

	const onSubmit = useCallback(
		(data: ReturnType<typeof connectionSchema.parse>) => {
			join.mutate(
				{
					name: data.name,
					onConnect: (id) => {
						if (id) {
							authAdapter.setToken(id);
							routerAdapter.push(
								navigationAdapter.generateRoute({
									name: RouteName.HOME,
								}),
							);
						} else {
							notificationAdapter.notify({
								type: "error",
								msg: "Join request failed. Please try again.",
							});
						}
					},
					onDisconnect: () => {
						authAdapter.removeToken();
						notificationAdapter.notify({
							type: "error",
							msg: "Disconnected from server",
						});
					},
					onGamesChanged: () => {
						queryClient.invalidateQueries({
							queryKey: [QueryKeys.AVAILABLE_ROOMS],
						});
					},
					onUserGameChanged: () => {
						queryClient.invalidateQueries({
							queryKey: [QueryKeys.USER_GAME],
						});
					},
					onUserGameRemoved: () => {
						queryClient.invalidateQueries({
							queryKey: [QueryKeys.USER_GAME],
						});

						notificationAdapter.notify({
							type: "error",
							msg: "Game ended by server",
						});
					},
				},
				{
					onError: (e) => {
						FormUtils.handleApiErrors({
							error: e,
							setError: form.setError,
						});
					},
				},
			);
		},
		[
			authAdapter.removeToken,
			authAdapter.setToken,
			form.setError,
			join.mutate,
			navigationAdapter.generateRoute,
			notificationAdapter.notify,
			queryClient.invalidateQueries,
			routerAdapter.push,
		],
	);

	const errors = form.formState.errors;
	const rootErrorMessage = errors.root?.message;

	return (
		<Card mx="auto" maw="512" withBorder>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Box ta="center" mb="md">
					<Text size="xl" fw="bold">
						Connection
					</Text>
					<Text size="sm">Welcome to tic-tac-toe!</Text>
				</Box>
				<TextInput
					size="sm"
					label="Username"
					placeholder="Username"
					{...form.register("name")}
					error={errors.name?.message}
				/>
				{rootErrorMessage && (
					<>
						<Space h="xl" />
						<Alert color="red" title={rootErrorMessage} />
					</>
				)}
				<Space h="xl" />
				<Button fullWidth loading={join.isPending} type="submit">
					Join
				</Button>
			</form>
		</Card>
	);
}
