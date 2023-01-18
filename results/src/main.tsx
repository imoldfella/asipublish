import './index.css'
import { For, render } from 'solid-js/web'

import data from './files.json'
import feature from './feature.json'

import trx from './trx.json'
import { createSignal, JSXElement, Show } from 'solid-js'
const ox = trx as UnitTest[]
const failed = ox.filter((e) => e.outcome == "Failed")

interface UnitTest {
    test_name: string
    outcome: string
    output: string
    error: string
    stack: string
}

function PictureName(props: { path: string }) {

    return <a id={props.path.split('/')[1]} ><h4 class="pt-4 text-2xl font-bold dark:text-white">{props.path.split("/").slice(1).join(": ")}</h4></a>
}

interface Step {
    name: string
    screen: string
}
interface TestData {
    test_name: string
    output: string
    scenario?: string
    given?: string
    when?: string
    then?: string
    step: Step[]
}

interface Feature {
    name: string
    description: string
    test: TestData[]
}

const tests = new Map<string, TestData>()
const features = new Map<string, Feature>()
function buildTests() {

    const dx = (data as string[]).filter((e) => e.split('.').pop() == "jpg")
    console.log(dx)

    // feature.forEach((e)=>{
    //     features.set(e.name,{
    //         name: e.name,

    // })
    trx.forEach((e) => {
        tests.set(e.test_name, {
            test_name: e.test_name,
            output: e.output,
            step: []
        })
    })

    // dx is a list of files, but we need the output in trx?
    dx.forEach((e: string) => {
        const [_, test, step] = e.split('/')
        const trx = tests.get(test)
        if (trx) {
            trx.step.push({
                name: step,
                screen: e
            })
        }
    })
}
buildTests()
console.log(tests)

function Test(props: { test: TestData }) {
    const [path, setPath] = createSignal(props.test.step[0])
    const scr = () => `TestResults/${path().screen}`
    const [log, showLog] = createSignal(false)
    return <div>
        <a id={props.test.test_name}> <h3 class="text-2xl font-bold dark:text-white pt-4 pb-2">{props.test.test_name}</h3></a>
        <button
            class='cursor-pointer text-blue-700 hover: text-blue:600' onClick={() => { showLog(!log()) }} >Show Log</button>
        <Show when={log()}>
            <pre>
                {props.test.output}
            </pre>
        </Show>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg pt-4 flex flex-row" >
            <div class='flex-none'>
                <a target='blank' href={scr()} ><img class=' mr-2 h-96' src={scr()} alt={path().name} loading="lazy" /></a>

            </div>
            <div class='flex-1'>
                <For each={props.test.step}>{(e, i) => {
                    return <div><a class='text-blue-700 hover:text-blue-600 cursor-pointer' onClick={
                        () => { setPath(e) }
                    }>{e.name}</a></div>
                }}</For></div>

        </div></div>
}
function H2(props: { children: JSXElement }) {
    return <h4 class="pt-4 pb-2 text-2xl font-bold dark:text-white">{props.children}</h4>
}
function H3(props: { children: JSXElement }) {
    return <h4 class="pt-4 text-2xl font-bold dark:text-white">{props.children}</h4>
}
function TagList(props: { each: string[] }) {
    if (!props.each.length) return <div />
    else {
        const [first, ...rest] = props.each
        return <div>
            <For each={rest}>{(e, i) => `, ${e}`}</For>
        </div>
    }
}
function Features(props: {}) {
    return <div>
        <For each={feature}>{(e, i) => <div>
            <H3>{e.name}</H3>
            <p>{e.description}</p>
            <div >
                <For each={e.test}>{(ex, i) => <div class='text-neutral-200 py-2' >
                    <table>
                        <tbody>
                        <tr>
                         <td class='text-green-400 pr-2'>Name</td><td>
                            <a href={'#'+ex.name} class='text-blue-500 hover:text-blue-700'>{ex.name}</a></td></tr>
                            
                            <tr>
                                <td class='text-green-400 pr-2'>Scenario</td><td>{ex.scenario}</td></tr>
                            <tr> <td class='text-green-400 pr-2'>Given</td><td>{ex.given}</td></tr>
                            <tr><td class='text-green-400 pr-2'>When</td><td>{ex.when}</td></tr>
                            <tr><td class='text-green-400 pr-2'>Then</td><td>{ex.then}</td></tr>
                        </tbody></table>


                    <TagList each={ex.tag} />

                </div>}</For>
            </div>
        </div>
        }</For>
    </div>
}
function App() {
    const tst = [...tests.values()]
    return <div class='pl-2 pr-2 overflow-hidden'>
        <H2> Errors </H2>
        <For each={failed}>{(e, i) => {
            return <a href={'#' + e.test_name} class="block mb-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-red-500">{e.test_name}</h5>
                <div class='w-full overflow-x-scroll'>
                    <pre class="font-normal text-gray-700 dark:text-gray-400 overflow-wrap">
                        {e.error}
                    </pre>
                    <pre class="font-normal text-gray-700 dark:text-gray-400 overflow-wrap ">
                        {e.stack}
                    </pre></div></a>
        }}</For>

        <Features />

        <H2>All tests</H2>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Test
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Outcome
                        </th>

                    </tr>
                </thead>
                <tbody>
                    <For each={ox}>{(e, i) => {
                        return <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <a href={'#' + e.test_name}>{e.test_name}</a>
                            </th>
                            <td class="px-6 py-4">
                                {e.outcome}
                            </td>
                        </tr>
                    }}</For>
                </tbody>
            </table>
        </div>

        <For each={tst}>{(e, i) => <Test test={e} />}</For>
    </div>
}
render(App, document.getElementById('app')!);


/*
        <For each={dx} >{(e, i) => {
            return <div><PictureName path={e} /><div class="border-solid border-2 border-sky-500 m-4"><img src={`TestResults/${e}`} alt="..." loading="lazy" /></div></div>
        }}</For>*/
