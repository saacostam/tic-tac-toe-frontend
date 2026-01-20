package app

import (
	"myapp/domain"
)

type GetUserUseCase struct {
	userRepo domain.UserRepo
}

func NewGetUserUseCase(
	userRepo domain.UserRepo,
) *GetUserUseCase {
	return &GetUserUseCase{
		userRepo: userRepo,
	}
}

func (uc *GetUserUseCase) Execute(id string) (*domain.User, error) {
	user, err := uc.userRepo.GetUserById(id)

	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, domain.NewDomainError(
			"user not found",
			"[GetUserUseCase] user not found",
			domain.ErrBadRequest,
			nil,
		)
	}

	return user, nil
}
