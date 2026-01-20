package app

import (
	"myapp/domain"
)

type EndGameUseCase struct {
	eventAdapter domain.EventAdapter
	gameRepo     domain.GameRepo
	userRepo     domain.UserRepo
}

func NewEndGameUseCase(
	eventAdapter domain.EventAdapter,
	gameRepo domain.GameRepo,
	userRepo domain.UserRepo,
) *EndGameUseCase {
	return &EndGameUseCase{
		eventAdapter: eventAdapter,
		gameRepo:     gameRepo,
		userRepo:     userRepo,
	}
}

func (uc *EndGameUseCase) Execute(
	gameId string,
	userId string,
) error {
	game, getGameByIdErr := uc.gameRepo.GetGameById(gameId)

	if getGameByIdErr != nil {
		return getGameByIdErr
	}

	if game == nil {
		return domain.NewDomainError(
			"game not found",
			"[endGameUserCase.GetGameById] game not found by id "+gameId,
			domain.ErrBadRequest,
			nil,
		)
	}

	// Remove userId
	var newPlayers []string = []string{}
	for _, playerId := range game.Players {
		if playerId != userId {
			newPlayers = append(newPlayers, playerId)
		}
	}
	game.Players = newPlayers

	// Update state or delete
	hasRemovedGame := false
	if game.Status == domain.GameStarted || len(game.Players) == 0 {
		removeErr := uc.gameRepo.RemoveGame(gameId)
		if removeErr != nil {
			return removeErr
		}
		hasRemovedGame = true
	} else {
		updatedErr := uc.gameRepo.UpdateGameById(gameId, *game)
		if updatedErr != nil {
			return updatedErr
		}
	}

	// Notify
	// TODO: Parallel call this or create batch call to game
	message := ""
	if hasRemovedGame {
		message = "Game was ended"
	}
	for _, playerId := range game.Players {
		if err := uc.eventAdapter.Publish(playerId, domain.UserGameChangedEventType, message); err != nil {
			return err
		}
	}

	if hasRemovedGame {
		if err := uc.eventAdapter.Broadcast(domain.GamesChangedEventType); err != nil {
			return err
		}
	}

	return nil
}
