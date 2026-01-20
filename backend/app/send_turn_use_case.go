package app

import (
	"myapp/domain"
)

type SendTurnUseCase struct {
	eventAdapter domain.EventAdapter
	gameRepo     domain.GameRepo
}

func NewSendTurnUseCase(
	eventAdapter domain.EventAdapter,
	gameRepo domain.GameRepo,
) *SendTurnUseCase {
	return &SendTurnUseCase{
		eventAdapter: eventAdapter,
		gameRepo:     gameRepo,
	}
}

func (uc *SendTurnUseCase) Execute(
	gameId string,
	userId string,
	x int,
	y int,
) error {
	game, getGameByIdErr := uc.gameRepo.GetGameById(gameId)

	if getGameByIdErr != nil {
		return getGameByIdErr
	}

	if game == nil {
		return domain.NewDomainError(
			"game not found",
			"[sendTurnUseCase.GetGameById] game not found by id "+gameId,
			domain.ErrBadRequest,
			nil,
		)
	}

	// Valid State
	if len(game.Players) < 2 || game.Status == domain.GameFinished {
		return domain.NewDomainError(
			"game is not playable",
			"[sendTurnUseCase.gameState] game with id "+gameId+" can't apply turn, as it is in invalid state",
			domain.ErrBadRequest,
			nil,
		)
	}

	// Apply turn
	turn := domain.Turn{
		X:        x,
		Y:        y,
		PlayerId: userId,
	}

	gameWithTurn, getGameByIdErr := domain.GameService.ApplyTurn(*game, turn)
	if getGameByIdErr != nil {
		return getGameByIdErr
	}
	game = gameWithTurn

	// Check checkWin condition
	checkWin := domain.GameService.CheckWinCondition(*game, domain.CheckWinConditionArgs{
		Player1UserId: game.Players[0],
		Player2UserId: game.Players[1],
	})
	if checkWin.HasWinCondition {
		game.Status = domain.GameFinished
		game.WinnerPlayerId = &checkWin.WinnerUserId
	}

	// Update state
	updatedErr := uc.gameRepo.UpdateGameById(gameId, *game)
	if updatedErr != nil {
		return updatedErr
	}

	// TODO: Parallel call this or create batch call to game
	for _, playerId := range game.Players {
		if err := uc.eventAdapter.Publish(playerId, domain.UserGameChangedEventType, ""); err != nil {
			return err
		}
	}

	return nil
}
