package domain

// Constructor

type gameService struct{}

func newGameService() *gameService {
	return &gameService{}
}

var GameService = newGameService()

// Shared Types

type BoardStatus *string
type Board [3][3]BoardStatus

// =====================
// Public Methods
// =====================

// Apply Turn

func (s *gameService) ApplyTurn(game Game, turn Turn) (*Game, error) {
	board := s.createBoardFromTurns(game.Turns)

	// Validate cell
	if board[turn.Y][turn.X] != nil {
		return nil, NewDomainError(
			"Invalid game move - invalid cell position",
			"[gameService.ApplyTurn] invalid game move",
			ErrConflict,
			nil,
		)
	}

	// Determine last player
	lastPlayerId := game.Players[1]
	if len(game.Turns) > 0 {
		lastPlayerId = game.Turns[len(game.Turns)-1].PlayerId
	}

	if lastPlayerId == turn.PlayerId {
		return nil, NewDomainError(
			"Invalid game move - not the user's turn",
			"[gameService.ApplyTurn] invalid game move",
			ErrConflict,
			nil,
		)
	}

	game.Turns = append(game.Turns, turn)
	return &game, nil
}

// Check Win Condition

type CheckWinConditionArgs struct {
	Player1UserId string
	Player2UserId string
}

type CheckWinConditionResult struct {
	HasWinCondition bool
	WinnerUserId    string
}

func (s *gameService) CheckWinCondition(
	game Game,
	args CheckWinConditionArgs,
) CheckWinConditionResult {
	board := s.createBoardFromTurns(game.Turns)

	if s.hasWin(board, args.Player1UserId) {
		return CheckWinConditionResult{true, args.Player1UserId}
	}

	if s.hasWin(board, args.Player2UserId) {
		return CheckWinConditionResult{true, args.Player2UserId}
	}

	return CheckWinConditionResult{}
}

// Is Open

func (s *gameService) IsOpen(game Game) bool {
	return len(game.Players) < 2
}

// =====================
// Private Methods
// =====================

// Board helpers

func (s *gameService) createEmptyBoard() Board {
	return Board{}
}

func (s *gameService) createBoardFromTurns(turns []Turn) Board {
	board := s.createEmptyBoard()

	for _, turn := range turns {
		if board[turn.Y][turn.X] == nil {
			playerId := turn.PlayerId // ensure stable pointer
			board[turn.Y][turn.X] = &playerId
		}
	}

	return board
}

// Win detection

func (s *gameService) hasWin(board Board, playerId string) bool {
	isPlayer := func(cell BoardStatus) bool {
		return cell != nil && *cell == playerId
	}

	// Rows
	for r := 0; r < 3; r++ {
		if isPlayer(board[r][0]) &&
			isPlayer(board[r][1]) &&
			isPlayer(board[r][2]) {
			return true
		}
	}

	// Columns
	for c := 0; c < 3; c++ {
		if isPlayer(board[0][c]) &&
			isPlayer(board[1][c]) &&
			isPlayer(board[2][c]) {
			return true
		}
	}

	// Diagonals
	if isPlayer(board[0][0]) &&
		isPlayer(board[1][1]) &&
		isPlayer(board[2][2]) {
		return true
	}

	if isPlayer(board[0][2]) &&
		isPlayer(board[1][1]) &&
		isPlayer(board[2][0]) {
		return true
	}

	return false
}
