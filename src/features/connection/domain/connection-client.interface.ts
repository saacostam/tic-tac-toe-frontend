export interface IConnectionClient {
	close(): void;
	join(args: IConnectionClientPayload["JoinIn"]): Promise<void>;
}

export interface IConnectionClientPayload {
	JoinIn: {
		name: string;
		onConnect: (id: string | null) => void;
		onGamesChanged: (msg?: string) => void;
		onUserGameChanged: (msg?: string) => void;
		onUserGameRemoved: () => void;
		onDisconnect: () => void;
	};
}
