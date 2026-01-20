package app

import (
	"myapp/domain"
	"slices"
)

type JoinGameUseCase struct {
	eventAdapter domain.EventAdapter
	gameRepo     domain.GameRepo
	userRepo     domain.UserRepo
}

func NewJoinGameUseCase(
	eventAdapter domain.EventAdapter,
	gameRepo domain.GameRepo,
	userRepo domain.UserRepo,
) *JoinGameUseCase {
	return &JoinGameUseCase{
		eventAdapter: eventAdapter,
		gameRepo:     gameRepo,
		userRepo:     userRepo,
	}
}

func (uc *JoinGameUseCase) Execute(userId string, gameId string) error {
	user, err := uc.userRepo.GetUserById(userId)

	if err != nil {
		return err
	}

	if user == nil {
		return domain.NewDomainError(
			"user does not exist",
			"[JoinGameUseCase] user by id "+userId+" not found",
			domain.ErrNotFound,
			nil,
		)
	}

	gamesByUser, err := uc.gameRepo.GetGamesByUserId(user.ID)

	if err != nil {
		return err
	}

	if slices.ContainsFunc(gamesByUser, domain.GameService.IsOpen) {
		return domain.NewDomainError(
			"user already has a game in progress",
			"[JoinGameUseCase] user by id "+userId+" has an open game",
			domain.ErrConflict,
			nil,
		)
	}

	game, err := uc.gameRepo.GetGameById(gameId)
	if err != nil {
		return err
	}

	if game == nil {
		return domain.NewDomainError(
			"game does not exist",
			"[JoinGameUseCase] game by id "+gameId+" not found",
			domain.ErrNotFound,
			nil,
		)
	}

	if game.Status == domain.GameFinished {
		return domain.NewDomainError(
			"cannot join this game — it has already ended.",
			"[JoinGameUseCase] attempting to join game with id "+gameId+" that has already started",
			domain.ErrConflict,
			nil,
		)
	}

	isOpen := domain.GameService.IsOpen(*game)
	if !isOpen {
		return domain.NewDomainError(
			"cannot join game, already full",
			"[JoinGameUseCase] game by id "+gameId+" already full",
			domain.ErrConflict,
			nil,
		)
	}

	game.Players = append(game.Players, user.ID)
	updateErr := uc.gameRepo.UpdateGameById(gameId, *game)

	if updateErr != nil {
		return updateErr
	}

	// TODO: Parallel call this or create batch call to game
	for _, playerId := range game.Players {
		if err := uc.eventAdapter.Publish(playerId, domain.UserGameChangedEventType, ""); err != nil {
			return err
		}
	}

	return nil
}
