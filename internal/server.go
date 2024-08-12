package internal

import (
	"io"
	"net"
	"net/http"
	"noted/internal/services/notes"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

func Server(httpPort chan<- int) {
	// start http server

	http.HandleFunc("/upload-file", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// upload file
		file, fileHeader, err := r.FormFile("file")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer file.Close()

		// read file
		data, err := io.ReadAll(file)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		userHomeDir, _ := os.UserHomeDir()
		userHomeDir = userHomeDir + "/noted"
		filePath := userHomeDir + "/assets"

		// create directory if not exists
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			os.Mkdir(filePath, 0755)
		}

		// get file extension
		ext := filepath.Ext(fileHeader.Filename)

		// generate file name
		fileName := uuid.New().String() + ext
		filePath = filePath + "/" + fileName

		// write file
		err = os.WriteFile(filePath, data, 0644)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// add path to uploaded files
		notes.UploadedFiles[filePath] = false

		// response json with file path
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"path":"` + filePath + `"}`))
	})

	// set listener
	l, err := net.Listen("tcp", ":0")
	if err != nil {
		panic(err)
	}

	defer l.Close()

	// send port
	httpPort <- l.Addr().(*net.TCPAddr).Port

	// print port
	println("Server running on port", l.Addr().(*net.TCPAddr).Port)
	http.Serve(l, nil)
}
