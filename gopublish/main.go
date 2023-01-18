package main

import (
	"encoding/json"
	"io"
	"io/fs"
	"os"
	"path/filepath"
)

func TestResults(pth string, out string) {
	r := []string{}
	matchGo := func(p string, d fs.DirEntry, err error) error {
		if filepath.Ext(p) == ".jpg" {
			r = append(r, p)
		}
		return nil
	}
	fsys := os.DirFS(pth)
	fs.WalkDir(fsys, ".", matchGo)
	b, e := json.MarshalIndent(r, "", "  ")
	if e != nil {
		panic(e)
	}
	os.WriteFile(out, b, 0666)
}

func main() {

}

func Pipe() {
	bytes, err := io.ReadAll(os.Stdin)
	if err != nil {
		panic(err)
	}
	process(bytes, "output.parquet")
}
