package infra

import (
	"fmt"
	"log"
	"myapp/domain"
	"strconv"
	"sync"
)

type InMemoryUserRepo struct {
	mu     sync.Mutex
	users  map[string]domain.User
	lastID int
}

func NewInMemoryUserRepo() *InMemoryUserRepo {
	return &InMemoryUserRepo{
		users:  map[string]domain.User{},
		lastID: 0,
	}
}

func (repo *InMemoryUserRepo) CreateUser(name string) (domain.User, error) {
	repo.mu.Lock()
	defer repo.mu.Unlock()

	repo.lastID++
	user := domain.User{
		ID:   strconv.Itoa(repo.lastID),
		Name: name,
	}
	repo.users[user.ID] = user
	return user, nil
}

func (repo *InMemoryUserRepo) GetUserById(id string) (*domain.User, error) {
	repo.mu.Lock()
	defer repo.mu.Unlock()

	log.Println("[InMemoryUserRepo.GetUserById] users", repo.users)

	user, exists := repo.users[id]
	if !exists {
		return nil, nil
	}
	return &user, nil
}

func (repo *InMemoryUserRepo) RemoveUser(id string) error {
	repo.mu.Lock()
	defer repo.mu.Unlock()

	if _, exists := repo.users[id]; !exists {
		return domain.NewDomainError(
			"user not found",
			"cannot delete non-existent user with ID: "+fmt.Sprint(id),
			domain.ErrNotFound,
			nil,
		)
	}
	delete(repo.users, id)
	return nil
}
