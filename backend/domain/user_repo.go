package domain

type UserRepo interface {
	CreateUser(name string) (User, error)
	GetUserById(id string) (*User, error)
	RemoveUser(id string) error
}
