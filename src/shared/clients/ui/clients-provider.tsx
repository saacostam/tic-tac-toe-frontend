import { type PropsWithChildren, useMemo } from "react";
import { ConnectionClient } from "@/features/connection/infra";
import { GameClient } from "@/features/game/infra";
import { ClientsContext } from "../app";
import type { IClients } from "../domain";

/**
 * Provider component to supply application clietns to the component tree.
 *
 * This component wraps its children with the necessary context provider (`ClientsContext.Provider`)
 * to make clients available throughout the app.
 *
 * @param {PropsWithChildren} props - The props object containing the children to be rendered.
 *
 * @returns {JSX.Element} A context provider wrapping the children with available clients.
 */
export function ClientsProvider({ children }: PropsWithChildren) {
	const clients: IClients = useMemo(
		() => ({
			connectionClient: new ConnectionClient(),
			gameClient: new GameClient(),
		}),
		[],
	);

	return (
		<ClientsContext.Provider value={clients}>
			{children}
		</ClientsContext.Provider>
	);
}
