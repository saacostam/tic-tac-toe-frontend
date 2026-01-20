package app_test

import (
	"testing"

	"myapp/app"
	"myapp/domain"
	"myapp/mock"

	"github.com/stretchr/testify/assert"
)

func TestQueryAvailableGameUseCase_Execute_Success(t *testing.T) {
	// Arrange
	repo := new(mock.MockGameRepo)

	expectedGames := []domain.Game{
		{ID: "game-1"},
		{ID: "game-2"},
	}

	repo.
		On("GetOpenGames").
		Return(expectedGames, nil).
		Once()

	uc := app.NewQueryAvailableGameUseCase(repo)

	// Act
	result, err := uc.Execute()

	// Assert
	assert.NoError(t, err)
	assert.Equal(t, expectedGames, result)

	repo.AssertExpectations(t)
}
