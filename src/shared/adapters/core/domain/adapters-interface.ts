import type { IAnalyticsAdapter } from "@/shared/adapters/analytics/domain";
import type { IErrorMonitoringAdapter } from "@/shared/adapters/error-monitoring/domain";
import type { INavigationAdapter } from "@/shared/adapters/navigation/domain";
import type { INotificationAdapter } from "@/shared/adapters/notification/domain";
import type { IPersistenceAdapter } from "@/shared/adapters/persistence/domain";
import type { IRouterAdapter } from "@/shared/adapters/router/domain";
import type { ISessionAdapter } from "@/shared/adapters/session/domain";
import type { IThemeAdapter } from "@/shared/adapters/theme/domain";
import type { IUuidAdapter } from "@/shared/adapters/uuid/domain";

/**
 * Interface for managing various application adapters.
 */
export interface IAdapters {
	analyticsAdapter: IAnalyticsAdapter;
	sessionAdapter: ISessionAdapter;
	errorMonitoringAdapter: IErrorMonitoringAdapter;
	navigationAdapter: INavigationAdapter;
	notificationAdapter: INotificationAdapter;
	persistenceAdapter: IPersistenceAdapter;
	routerAdapter: IRouterAdapter;
	themeAdapter: IThemeAdapter;
	uuidAdapter: IUuidAdapter;
}
