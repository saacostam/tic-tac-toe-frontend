package app

import (
	"myapp/domain"
)

type QueryAvailableGameUseCase struct {
	gameRepo domain.GameRepo
}

func NewQueryAvailableGameUseCase(
	gameRepo domain.GameRepo,
) *QueryAvailableGameUseCase {
	return &QueryAvailableGameUseCase{
		gameRepo: gameRepo,
	}
}

func (uc *QueryAvailableGameUseCase) Execute() ([]domain.Game, error) {
	return uc.gameRepo.GetOpenGames()
}
