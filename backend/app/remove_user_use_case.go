package app

import (
	"myapp/domain"
)

type RemoveUserUseCase struct {
	eventAdapter domain.EventAdapter
	gameRepo     domain.GameRepo
	userRepo     domain.UserRepo
}

func NewRemoveUserUseCase(
	eventAdapter domain.EventAdapter,
	gameRepo domain.GameRepo,
	userRepo domain.UserRepo,
) *RemoveUserUseCase {
	return &RemoveUserUseCase{
		eventAdapter: eventAdapter,
		gameRepo:     gameRepo,
		userRepo:     userRepo,
	}
}

func (uc *RemoveUserUseCase) Execute(id string) (string, error) {
	user, err := uc.userRepo.GetUserById(id)

	if err != nil {
		return "", err
	}

	if user == nil {
		return id, nil
	}

	// Remove games from player
	games, err := uc.gameRepo.GetGamesByUserId(user.ID)

	for _, game := range games {
		uc.gameRepo.RemoveGame(game.ID)

		// Notify each player
		for _, playerId := range game.Players {
			uc.eventAdapter.Publish(playerId, domain.UserGameRemovedEventType, "")
		}
	}

	// Notify games-update
	uc.eventAdapter.Broadcast(domain.GamesChangedEventType)

	// Remove player
	remErr := uc.userRepo.RemoveUser(id)

	return id, remErr
}
