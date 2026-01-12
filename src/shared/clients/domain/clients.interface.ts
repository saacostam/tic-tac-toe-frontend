import type { IConnectionClient } from "@/features/connection/domain";
import type { IGameClient } from "@/features/game/domain";

/**
 * Interface for managing various application clients.
 */
export interface IClients {
	connectionClient: IConnectionClient;
	gameClient: IGameClient;
}
