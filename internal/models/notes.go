package models

type Note struct {
	ID        int    `db:"id" json:"id"`
	Title     string `db:"title" json:"title"`
	Content   string `db:"content" json:"content"`
	Html      string `db:"html" json:"html"`
	CreatedAt string `db:"created_at" json:"created_at"`
	UpdatedAt string `db:"updated_at" json:"updated_at"`
}
