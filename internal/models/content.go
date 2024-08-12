package models

type Content struct {
	ID    string `json:"id"`
	Type  string `json:"type"`
	Props Props  `json:"props"`
}

type Props struct {
	Url     string `json:"url"`
	Caption string `json:"caption"`
}
