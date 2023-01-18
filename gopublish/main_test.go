package main

import (
	"os"
	"testing"
)

const (
	results = "../results/public/TestResults"
	src     = "../results/src"
	trx     = results + "/testResults.trx"
)

func Test_one(t *testing.T) {
	b, e := os.ReadFile(trx)
	if e != nil {
		panic(e)
	}
	process(b, src+"/trx.json")
	TestResults(results, src+"/files.json")
}
