import './index.css'
import { Component, createSignal, For, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import { Route, Routes, Router, A } from "@solidjs/router";
import {TestView} from './testview'
import { H2 } from './widget';
import { TestData, UnitTest } from './data';
import { Nav } from './nav';

// how should I gather the feature files?
// change to SSR (astro?)
// there's no need to actually run any of this code on the client
// maybe the go should be called from the nodejs renderer.





async function buildTests(): Promise<Map<string,TestData>> {

    async function testLog() : Promise<Map<string,TestData> > {
        const tests = new Map<string, TestData>()
        const trx: UnitTest[] = await (await fetch('trx.json')).json();
        for (let e of trx ) {
            tests.set(e.test_name, {
                test_name: e.test_name,
                test: e,    
                output: '',
                step: []
            })
        }
        return tests
    }

    async function screen_shots() : Promise<string[]> {
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


const Home:Component<{}> = ()=> {
    const [ox, setOx] = createSignal<TestData[]>([])

    onMount(async () => {
        const ox = await buildTests()
        const td = [... ox.values()]
        // sort tests as failed first
        td.sort((a,b) => a.test.outcome.localeCompare(b.test.outcome))
        setOx(td);
    })


    return <><Nav/>
    <div class='pl-2 pr-2 mt-2 overflow-hidden'>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Outcome
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Test
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <For each={ox()}>{(e, i) => {
                        return <tr onClick={()=>{location.href='/test/'+e.test_name }} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" class="px-6 py-4">
                                {e.test.outcome}
                            </th>
                            <td  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <a href={'#' + e.test_name}>{e.test_name}</a>
                            </td>
                        </tr>
                    }}</For>
                </tbody>
            </table>
        </div>
    </div></>
}


function App() {
    return <>
        <Routes>
            <Route path="/test/:id?" component={TestView as any} />
            <Route path="/" component={Home} />
            <Route path="/about" element={<div>This site was made with Solid</div>} />
        </Routes></>
}
render(
    () => (
        <Router>
            <App />
        </Router>
    ),
    document.getElementById("app")!
);

/*
        <For each={dx} >{(e, i) => {
            return <div><PictureName path={e} /><div class="border-solid border-2 border-sky-500 m-4"><img src={`TestResults/${e}`} alt="..." loading="lazy" /></div></div>
        }}</For>*/
