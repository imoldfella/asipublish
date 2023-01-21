import './index.css'
import { Component, createSignal, For, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import { Route, Routes, Router, A, useNavigate } from "@solidjs/router";
import { TestView } from './testview'
import { H2 } from './widget';
import { TestData, UnitTest, ox } from './data';
import { Nav } from './nav';

// how should I gather the feature files?
// change to SSR (astro?)
// there's no need to actually run any of this code on the client
// maybe the go should be called from the nodejs renderer.



const Home: Component<{}> = () => {
    const navigate = useNavigate()
    return <><Nav tabs={tabs} selected={0} />
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
                            return <tr onClick={()=>navigate('/test/'+e.test_name)} class="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" class="px-6 py-4">
                                    {e.test.outcome}
                                </th>
                                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <A href={"/test/"+e.test_name}>{e.test_name}</A>
                                </td>
                            </tr>
                        }}</For>
                    </tbody>
                </table>
            </div>
        </div></>
}

const tabs = [
    { name: 'V10', route: '/' },
    { name: 'V100', route: '/v100' },
    { name: 'Load', route: '/load' }
]
function Performance() {
    return <><Nav tabs={tabs} selected={2} />
        <p class='m-4'> coming soon </p>
    </>

}
function V100() {
    return <><Nav tabs={tabs} selected={1} />
        <p class='m-4'> coming soon </p>
    </>

}


function App() {
    return <>
        <Routes>
            <Route path="/test/:id" component={TestView as any} />
            <Route path="/" component={Home} />
            <Route path="/load" component={Performance} />
            <Route path="/v100" component={V100} />
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
