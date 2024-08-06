package main

import (
	"context"
	"embed"
	"noted/internal"
	"noted/internal/database"
	"noted/internal/services"
	"noted/internal/services/notes"

	"github.com/jmoiron/sqlx"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

var db *sqlx.DB

func main() {

	// create httpPort channel
	httpPort := make(chan int)

	// Create an instance of the app structure
	app := services.NewApp()
	note := notes.Init()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "noted",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets:  assets,
			Handler: internal.NewFileLoader(),
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			db = database.Init()

			app.Startup(ctx, db)
			note.Startup(ctx, db)

			// start server
			go internal.Server(httpPort)
			app.SetHttpPort(httpPort)
		},
		OnShutdown: func(ctx context.Context) {
			db.Close()
		},
		Bind: []interface{}{
			app,
			note,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
