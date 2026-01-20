package domain

/*
EVENT TYPES
*/

type EventType string

const (
	GamesChangedEventType    EventType = "GAMES_CHANGED"
	UserGameChangedEventType EventType = "USER_GAME_CHANGED"
	UserGameRemovedEventType EventType = "USER_GAME_REMOVED"
	UserIdEventType          EventType = "USER_ID"
)

type EventAdapter interface {
	Publish(
		id string,
		event EventType,
		message string,
	) error
	Broadcast(
		event EventType,
	) error
}
