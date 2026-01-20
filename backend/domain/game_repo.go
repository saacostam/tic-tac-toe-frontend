package domain

type GameRepo interface {
	CreateGame(userId string) error
	GetGameById(gameId string) (*Game, error)
	GetGamesByUserId(userId string) ([]Game, error)
	GetOpenGames() ([]Game, error)
	UpdateGameById(gameId string, game Game) error
	RemoveGame(gameId string) error
}
