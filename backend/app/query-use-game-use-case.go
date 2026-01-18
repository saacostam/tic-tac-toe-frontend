package app

import (
	"myapp/domain"
)

type queryUserGameUseCase struct {
	gameRepo domain.GameRepo
}

func NewQueryUserGameUseCase(
	gameRepo domain.GameRepo,
) *queryUserGameUseCase {
	return &queryUserGameUseCase{
		gameRepo: gameRepo,
	}
}

func (uc *queryUserGameUseCase) Execute(userId string) (*domain.Game, error) {
	games, err := uc.gameRepo.GetGamesByUserId(userId)
	if err != nil {
		return nil, err
	}

	if len(games) == 0 {
		return nil, nil
	}

	lastGame := games[len(games)-1]
	return &lastGame, nil
}
