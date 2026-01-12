export type IAnalyticsEvent = { name: "join"; payload: { success: boolean } };

export interface IAnalyticsAdapter {
	trackEvent(event: IAnalyticsEvent): void;
}
