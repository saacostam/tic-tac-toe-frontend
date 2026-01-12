export interface IConnectionClient {
	close(): void;
	join(args: IConnectionClientPayload["JoinIn"]): Promise<void>;
}

export interface IConnectionClientPayload {
	JoinIn: {
		name: string;
		onConnect: (id: string | null) => void;
		onGamesChanged: () => void;
		onUserGameChanged: () => void;
		onUserGameRemoved: () => void;
		onDisconnect: () => void;
	};
}
