package main

import (
	"encoding/json"
	"encoding/xml"
	"os"
)

type UnitTest struct {
	TestName string `json:"test_name,omitempty"`
	Outcome  string `json:"outcome,omitempty"`
	Output   string `json:"output,omitempty"`
	Error    string `json:"error,omitempty"`
	Stack    string `json:"stack,omitempty"`
}

func process(bytes []byte, path string) {

	var t TestRun
	e := xml.Unmarshal(bytes, &t)
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
	os.WriteFile(path, b, 0666)
}
