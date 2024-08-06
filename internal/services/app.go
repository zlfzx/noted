package services

import (
	"context"

	"github.com/jmoiron/sqlx"
)

// App struct
type App struct {
	ctx      context.Context
	db       *sqlx.DB
	httpPort int
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context, db *sqlx.DB) {
	a.ctx = ctx
	a.db = db
}

func (a *App) SetHttpPort(httpPort <-chan int) {
	a.httpPort = <-httpPort
}

func (a *App) GetHttpPort() int {
	return a.httpPort
}
