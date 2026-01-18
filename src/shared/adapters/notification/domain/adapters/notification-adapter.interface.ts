export interface INotificationAdapter {
	notify(args: INotificationAdapterPayload["NotifyIn"]): void;
}

export interface INotificationAdapterPayload {
	NotifyIn: {
		type: "success" | "error" | "info";
		msg: string;
		title?: string;
	};
}
