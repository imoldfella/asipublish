Trx is not able to capture fully qualified names
https://github.com/microsoft/vstest/issues/2845

So custom logger it is.

The custom logger will reference the fully qualified domain name, but this still doesn't get us a link to the gherkin. The AOT compiler can create a map though to the gherkin, maybe the original path.

Note that in the api documentation, it won't naturally have a file mapping either: file tree <> namespace in dotnet.




assumes that asipublish and asi1 are in the same directory
TestResults is directed into the public directory

```
dotnet test --results-directory "..\asipublish\results\public" --filter "TestCategory=v10" --logger "trx;nightly.trx" --output "../asipublish"
```

```
cd ..\results
npm run build
wrangler pages publish dist --project-name asi-datagrove
```

Go publish is a go program for processing the trx log and artifacts from the nightly test.

results is the target folder and also has some code and dependencies that are bundled with those results and then written to the server.


.runsettings
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <MSTest>
    <Parallelize>
      <Workers>8</Workers>
      <Scope>MethodLevel</Scope>
    </Parallelize>
  </MSTest>
</RunSettings>