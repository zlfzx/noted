package notes

import (
	"context"
	"encoding/json"
	"noted/internal/models"
	"os"
	"time"

	"github.com/jmoiron/sqlx"
)

var UploadedFiles = make(map[string]bool)

type Service struct {
	ctx context.Context
	db  *sqlx.DB
}

func Init() *Service {
	return &Service{}
}

func (s *Service) Startup(ctx context.Context, db *sqlx.DB) {
	s.ctx = ctx
	s.db = db
}

func (s *Service) GetNotes() (notes []models.Note, err error) {
	err = s.db.Select(&notes, "SELECT * FROM notes ORDER BY updated_at DESC")
	return
}

func (s *Service) GetNote(id int) (note models.Note, err error) {
	query := `
		SELECT
			id,
			title,
			content,
			html,
			STRFTIME('%Y-%m-%d %H:%M:%S', created_at) as created_at,
			STRFTIME('%Y-%m-%d %H:%M:%S', updated_at) as updated_at
		FROM notes
		WHERE id = ?
	`

	err = s.db.Get(&note, query, id)

	if note.ID != 0 {
		getContentFiles(note.Content)
	}

	return note, err
}

func getContentFiles(content string) {
	var contents []models.Content
	if err := json.Unmarshal([]byte(content), &contents); err == nil {
		// set content files to false
		for file := range UploadedFiles {
			UploadedFiles[file] = false
		}

		// Check which files are still in use by the note
		for _, content := range contents {
			if content.Type == "image" {
				if _, ok := UploadedFiles[content.Props.Url]; ok {
					UploadedFiles[content.Props.Url] = true
				}
			}
		}
	}
}

func (s *Service) RemoveUnusedFiles(content *string) {
	// Get content files
	if content != nil {
		getContentFiles(*content)
	}

	// Remove unused files
	for file, uploaded := range UploadedFiles {
		if !uploaded {
			os.Remove(file)
		}
	}
}

func (s *Service) SaveNote(note models.Note) (models.Note, error) {

	// remove unused files
	s.RemoveUnusedFiles(&note.Content)

	// If the note has an ID, update it
	if note.ID != 0 {
		note.UpdatedAt = time.Now().Format("2006-01-02 15:04:05")

		_, err := s.db.NamedExec(`
			UPDATE notes 
			SET 
				title = :title, 
				content = :content, 
				html = :html, 
				updated_at = :updated_at 
			WHERE id = :id
		`, note)

		return note, err
	}

	// Insert the note into the database
	result, err := s.db.NamedExec(`
		INSERT INTO notes (title, content, html) VALUES (:title, :content, :html)
	`, note)
	if err != nil {
		return models.Note{}, err
	}

	// Get the ID of the new note
	id, err := result.LastInsertId()
	if err != nil {
		return models.Note{}, err
	}

	// Set the ID on the new note
	note.ID = int(id)

	return note, nil
}

func (s *Service) DeleteNote(id int) error {
	_, err := s.db.Exec("DELETE FROM notes WHERE id = ?", id)
	return err
}
