package mock

import (
	"myapp/domain"

	"github.com/stretchr/testify/mock"
)

type MockGameRepo struct {
	mock.Mock
}

func (m *MockGameRepo) CreateGame(userId string) error {
	args := m.Called(userId)
	return args.Error(0)
}

func (m *MockGameRepo) GetGameById(gameId string) (*domain.Game, error) {
	args := m.Called(gameId)

	var game *domain.Game
	if g := args.Get(0); g != nil {
		game = g.(*domain.Game)
	}

	return game, args.Error(1)
}

func (m *MockGameRepo) GetGamesByUserId(userId string) ([]domain.Game, error) {
	args := m.Called(userId)

	var games []domain.Game
	if g := args.Get(0); g != nil {
		games = g.([]domain.Game)
	}

	return games, args.Error(1)
}

func (m *MockGameRepo) GetOpenGames() ([]domain.Game, error) {
	args := m.Called()

	var games []domain.Game
	if g := args.Get(0); g != nil {
		games = g.([]domain.Game)
	}

	return games, args.Error(1)
}

func (m *MockGameRepo) UpdateGameById(gameId string, game domain.Game) error {
	args := m.Called(gameId, game)
	return args.Error(0)
}

func (m *MockGameRepo) RemoveGame(gameId string) error {
	args := m.Called(gameId)
	return args.Error(0)
}

// Compile-time interface check
var _ domain.GameRepo = (*MockGameRepo)(nil)
