import { createSignal } from 'solid-js'


export interface UnitTest {
    test_name: string
    outcome: string
    output: string
    error: string
    stack: string
}


// not available yet, from AOT compiler?
export interface TestData {
    test_name: string
    test: UnitTest
    output: string
    scenario?: string
    given?: string
    when?: string
    then?: string
    step: Step[]
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
        const data = await (await fetch('../public/files.json')).json()
        return (data as string[]).filter((e) => e.split('.').pop() == "jpg")
    }

    // json created by the go app.
    // dx is a list of files, but we need the output in trx?
    const tests = await testLog();
    const shot = await screen_shots();

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



