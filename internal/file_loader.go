package internal

import (
	"fmt"
	"net/http"
	"os"
)

type FileLoader struct {
	http.Handler
}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	var err error
	// requestedFilename := strings.TrimPrefix(req.URL.Path, "/")
	requestedFilename := req.URL.Path
	fileData, err := os.ReadFile(requestedFilename)
	if err != nil {
		println("Could not load file", requestedFilename, ":", err.Error())
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
	}

	res.Write(fileData)
}
