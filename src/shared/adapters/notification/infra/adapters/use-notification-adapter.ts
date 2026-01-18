import { showNotification } from "@mantine/notifications";
import { useCallback, useMemo } from "react";
import type { IUuidAdapter } from "@/shared/adapters/uuid/domain";
import type { INotificationAdapter } from "../../domain";

export interface UseNotificationAdapterArgs {
	uuidAdapter: IUuidAdapter;
}

export function useNotificationAdapter({
	uuidAdapter,
}: UseNotificationAdapterArgs): INotificationAdapter {
	const notify: INotificationAdapter["notify"] = useCallback(
		(args) => {
			const msg = args.msg;
			const type = args.type;

			const title =
				args.type === "error"
					? "Error"
					: args.type === "success"
						? "Success"
						: "Info";

			showNotification({
				id: uuidAdapter.gen(),
				message: msg,
				title,
				color:
					type === "error" ? "red" : type === "success" ? "green" : "indigo",
				withCloseButton: true,
			});
		},
		[uuidAdapter.gen],
	);

	return useMemo(
		() => ({
			notify,
		}),
		[notify],
	);
}
