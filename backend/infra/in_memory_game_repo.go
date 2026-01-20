package infra

import (
	"myapp/domain"
	"sync"

	"github.com/google/uuid"
)

type InMemoryGameRepo struct {
	mu    sync.Mutex
	games map[string]domain.Game
}

func NewInMemoryGameRepo() *InMemoryGameRepo {
	return &InMemoryGameRepo{
		games: map[string]domain.Game{},
	}
}

func (repo *InMemoryGameRepo) CreateGame(userId string) error {
	repo.mu.Lock()
	defer repo.mu.Unlock()

	gameID := uuid.NewString() // generates a unique string ID

	game := domain.Game{
		ID:      gameID,
		Players: []string{userId},
		Turns:   []domain.Turn{},
		Status:  domain.GameStarted,
	}

	repo.games[game.ID] = game
	return nil
}

func (repo *InMemoryGameRepo) GetGameById(gameId string) (*domain.Game, error) {
	repo.mu.Lock()
	defer repo.mu.Unlock()

	game, exists := repo.games[gameId]
	if !exists {
		return nil, nil
	}

	return &game, nil
}

func (repo *InMemoryGameRepo) GetGamesByUserId(userId string) ([]domain.Game, error) {
	repo.mu.Lock()
	defer repo.mu.Unlock()

	var userGames []domain.Game

	for _, game := range repo.games {
		for _, playerId := range game.Players {
			if playerId == userId {
				userGames = append(userGames, game)
				break
			}
		}
	}

	return userGames, nil
}

func (repo *InMemoryGameRepo) GetOpenGames() ([]domain.Game, error) {
	repo.mu.Lock()
	defer repo.mu.Unlock()

	var openGames []domain.Game
	for _, game := range repo.games {
		if len(game.Players) < 2 && game.Status == domain.GameStarted {
			openGames = append(openGames, game)
		}
	}

	return openGames, nil
}

func (repo *InMemoryGameRepo) UpdateGameById(gameId string, game domain.Game) error {
	repo.mu.Lock()
	defer repo.mu.Unlock()

	_, exists := repo.games[gameId]
	if !exists {
		return domain.NewDomainError(
			"game does not exist",
			"[InMemoryGameRepo] cannot update game by id "+gameId,
			domain.ErrNotFound,
			nil,
		)
	}

	repo.games[gameId] = game
	return nil
}

func (repo *InMemoryGameRepo) RemoveGame(gameId string) error {
	repo.mu.Lock()
	defer repo.mu.Unlock()

	delete(repo.games, gameId)
	return nil
}
