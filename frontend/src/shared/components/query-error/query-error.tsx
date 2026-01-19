import { Alert, Button, Flex } from "@mantine/core";
import { ExclamationCircleIcon } from "@/shared/icons";

export interface QueryErrorProps {
	msg: string;
	retry: {
		onClick: () => void;
		isPending: boolean;
	};
	title?: string;
}

export function QueryError({ msg, retry, title: _title }: QueryErrorProps) {
	const title = _title ?? "Something went wrong!";

	return (
		<Alert
			color="red"
			data-testid="query-error"
			icon={<ExclamationCircleIcon />}
			title={title}
		>
			{msg}
			<Flex justify="end">
				<Button color="red" loading={retry.isPending} onClick={retry.onClick}>
					Retry
				</Button>
			</Flex>
		</Alert>
	);
}
