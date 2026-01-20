package app

import (
	"myapp/domain"
)

type AddUserUseCase struct {
	eventAdapter domain.EventAdapter
	userRepo     domain.UserRepo
}

func NewAddUserUseCase(
	eventAdapter domain.EventAdapter,
	userRepo domain.UserRepo,
) *AddUserUseCase {
	return &AddUserUseCase{
		eventAdapter: eventAdapter,
		userRepo:     userRepo,
	}
}

func (uc *AddUserUseCase) Execute(name string) (string, error) {
	createdUser, createErr := uc.userRepo.CreateUser(name)

	return createdUser.ID, createErr
}
