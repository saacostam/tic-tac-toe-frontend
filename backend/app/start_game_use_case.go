package app

import (
	"log"
	"myapp/domain"
	"slices"
)

type StartGameUseCase struct {
	eventAdapter domain.EventAdapter
	gameRepo     domain.GameRepo
	userRepo     domain.UserRepo
}

func NewStartGameUseCase(
	eventAdapter domain.EventAdapter,
	gameRepo domain.GameRepo,
	userRepo domain.UserRepo,
) *StartGameUseCase {
	return &StartGameUseCase{
		eventAdapter: eventAdapter,
		gameRepo:     gameRepo,
		userRepo:     userRepo,
	}
}

func (uc *StartGameUseCase) Execute(userId string) error {
	log.Println("[StartGameUseCase] start")

	user, userErr := uc.userRepo.GetUserById(userId)

	if userErr != nil {
		return userErr
	}

	log.Println("[StartGameUseCase] after querying user from user repo", user)

	if user == nil {
		return domain.NewDomainError(
			"user does not exist",
			"[StartGameUseCase] user by id "+userId+" not found",
			domain.ErrNotFound,
			nil,
		)
	}

	gamesByUser, gbuErr := uc.gameRepo.GetGamesByUserId(user.ID)

	if gbuErr != nil {
		log.Println("[StartGameUseCase] error from querying games from game repo", gbuErr.Error())
		return gbuErr
	}

	log.Println("[StartGameUseCase] after querying games from game repo")

	if slices.ContainsFunc(gamesByUser, domain.GameService.IsOpen) {
		return domain.NewDomainError(
			"user already has a game in progress",
			"[StartGameUseCase] user by id "+userId+" has an open game",
			domain.ErrConflict,
			nil,
		)
	}

	cgErr := uc.gameRepo.CreateGame(user.ID)

	if cgErr != nil {
		return cgErr
	}

	uc.eventAdapter.Broadcast(
		domain.GamesChangedEventType,
	)

	return nil
}
