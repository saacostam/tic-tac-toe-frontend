package domain

type GameStatus int

const (
	GameStarted GameStatus = iota
	GameFinished
)

type Game struct {
	ID             string
	Players        []string
	Turns          []Turn
	Status         GameStatus
	WinnerPlayerId *string
}
