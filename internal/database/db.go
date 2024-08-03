package database

import (
	"os"
	"path/filepath"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var appName = "noted"

func Init() *sqlx.DB {
	// Initialize the database
	db, err := sqlx.Open("sqlite3", getDataSource())
	if err != nil {
		panic(err)
	}

	// Create the notes table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS notes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title VARCHAR(255) NOT NULL,
			content TEXT NOT NULL,
			html TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`)

	if err != nil {
		panic(err)
	}

	return db
}

func getDataSource() string {
	homeDir, _ := os.UserHomeDir()
	dataDir := filepath.Join(homeDir, appName)
	os.MkdirAll(dataDir, os.FileMode(0755))
	return filepath.Join(dataDir, appName+".db")
}
