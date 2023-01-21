package main

import (
	"encoding/json"
	"encoding/xml"
	"io/fs"
	"os"
	"path/filepath"
)

type UnitTest struct {
	TestName string `json:"test_name,omitempty"`
	Outcome  string `json:"outcome,omitempty"`
	Output   string `json:"output,omitempty"`
	Error    string `json:"error,omitempty"`
	Stack    string `json:"stack,omitempty"`
}

func xml2json(inpath string, outpath string) {
	b, e := os.ReadFile(inpath)
	if e != nil {
		panic(e)
	}

	var t TestRun
	e = xml.Unmarshal(b, &t)
	if e != nil {
		panic(e)
	}
	var r = []UnitTest{}
	for _, x := range t.Results.UnitTestResult {
		var o UnitTest
		o.TestName = x.TestName
		o.Outcome = x.Outcome
		o.Output = x.Output.StdOut
		o.Error = x.Output.ErrorInfo.Message
		o.Stack = x.Output.ErrorInfo.StackTrace

		r = append(r, o)
	}

	b, err := json.Marshal(r)
	if err != nil {
		panic(err)
	}
	os.WriteFile(outpath, b, 0666)
}

// this walks pth and writes the selected files (for now just jpg) to a json that is just string[]
func TestResults(input string, out string) {
	r := []string{}
	matchGo := func(p string, d fs.DirEntry, err error) error {
		if filepath.Ext(p) == ".jpg" {
			r = append(r, p)
		}
		return nil
	}
	fsys := os.DirFS(input)
	fs.WalkDir(fsys, ".", matchGo)
	b, e := json.MarshalIndent(r, "", "  ")
	if e != nil {
		panic(e)
	}
	os.WriteFile(out, b, 0666)
}

func main() {

	xml2json("../results/public/TestResults/nightly.trx",
		"../results/public/trx.json")
	// provide a directory of the files to the renderer. should be SSR
	TestResults("../results/public/TestResults", "../results/public/")
}
