import type { ISession } from "../entities";

export interface IAuthAdapter {
	session: ISession;
	removeToken: () => void;
	setToken: (token: string, onClear: () => void) => void;
}
