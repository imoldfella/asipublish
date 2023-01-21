import { createSignal } from 'solid-js'


export interface UnitTest {
    test_name: string
    outcome: string
    output: string
    error: string
    stack: string
}


// not available yet, from AOT compiler?
// unit tests are single scenarios inside the feature. 
// should we try to highlight the step? we can't extract it because we need the background.
export interface TestData {
    test_name: string
    test: UnitTest
    output: string
    scenario?: string
    given?: string
    when?: string
    then?: string
    step: Step[]
    gherkin?: GherkinScenario
}
export interface Step {
    name: string
    screen: string
}
export interface Feature {
    name: string
    description: string
    test: TestData[]
}

export interface GherkinFile {
    path: string;
    source: string,
    qualified_name: string,
    // this should be markdown
    scenario: GherkinScenario[]
}
export interface GherkinStep {
    text: string
    matches: string
    stepDef: string
    screen: string
}
export interface GherkinScenario {
    name: string
    step: GherkinStep[]
    file?: GherkinFile
}
export interface Gherkin {
    feature: GherkinFile[]
}

async function buildTests(): Promise<Map<string, TestData>> {

    async function testLog(): Promise<Map<string, TestData>> {
        const tests = new Map<string, TestData>()
        const trx: UnitTest[] = await (await fetch('/trx.json')).json();
        for (let e of trx) {
            tests.set(e.test_name, {
                test_name: e.test_name,
                test: e,
                output: '',
                step: []
            })
        }
        return tests
    }

    async function screen_shots(): Promise<string[]> {
        const data = await (await fetch('../files.json')).json()
        return (data as string[]).filter((e) => e.split('.').pop() == "jpg")
    }

    async function getGherkin() {

    }

    // json created by the go app.
    // dx is a list of files, but we need the output in trx?
    const tests = await testLog();
    const shot = await screen_shots();
    const ghd = await fetch('../v10.cs.json')
    const ghx = await ghd.json() as Gherkin;
    const mscenario = new Map<string,GherkinScenario>();

    // this is crap, trx doesn't have qualified names, so we need to unqualify them. will fix with custom logger.
    for (let o of ghx.feature) {
        for (let sc of o.scenario) {
            sc.file = o
            const nm = sc.name.split('.')
            const n = nm.pop();
            if (n)
                mscenario.set(n, sc)
        }
    }
    for (let [k, v] of tests) {
        v.gherkin = mscenario.get(k)
    }
    console.log("tests", tests)
    console.log("scenario", mscenario)
    shot.forEach((e: string) => {
        const [_, test, step] = e.split('/')
        const trx = tests.get(test)
        if (trx) {
            trx.step.push({
                name: step,
                screen: e
            })
        }
    })
    return tests;
}

export const [ox, setOx] = createSignal<TestData[]>([]);
export const [tests, setTests] = createSignal<Map<string, TestData>>();
(async () => {
    const ox = await buildTests()
    setTests(ox);
    const td = [...ox.values()]
    // sort tests as failed first
    td.sort((a, b) => a.test.outcome.localeCompare(b.test.outcome))
    setOx(td);
})()



