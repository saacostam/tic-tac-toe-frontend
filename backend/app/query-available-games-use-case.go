package app

import (
	"myapp/domain"
)

type queryAvailableGameUseCase struct {
	gameRepo domain.GameRepo
}

func NewQueryAvailableGameUseCase(
	gameRepo domain.GameRepo,
) *queryAvailableGameUseCase {
	return &queryAvailableGameUseCase{
		gameRepo: gameRepo,
	}
}

func (uc *queryAvailableGameUseCase) Execute() ([]domain.Game, error) {
	return uc.gameRepo.GetOpenGames()
}
