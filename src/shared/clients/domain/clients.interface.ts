import type { IConnectionClient } from "@/features/connection/domain";
import type { ITodoClient } from "@/features/todo/domain";

/**
 * Interface for managing various application clients.
 */
export interface IClients {
	connectionClient: IConnectionClient;
	todoClient: ITodoClient;
}
