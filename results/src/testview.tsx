import { Component } from "solid-js";
import 'highlight.js/styles/github.css'
import hljs from 'highlight.js/lib/core';
import gherkin from 'highlight.js/lib/languages/gherkin';
import { UnitTest } from "./data";
hljs.registerLanguage('gherkin', gherkin);

import {  createSignal, For, JSXElement, onMount, Show } from 'solid-js'
import { render } from 'solid-js/web'
import { Route, Routes, Router, A } from "@solidjs/router";
import { Step } from './data'
import { Nav } from "./nav";

// with line fade https://www.felixmokross.dev/blog/code-samples-line-highlighting


const code = `
@AdAdjustments
Feature:Step 3 Ad Adjustments Test Suite v10

Scenario: Verify insert ad adjustments for media asset
	Given I am on the Staff site as designated user Staff
	When I insert ad adjustments for media asset ACRP Online
		| Key                | Value            |
		| ProductCode        | ADV              |
		| AdAdjustmentsName  | Agency Surcharge |
		| isAmount           | true             |
		| isSurcharge        | true             |
		| AdAdjustmentTarget | Running Total    |
		| AdAdjustmentValue  | 20               |
	Then I verify inserted ad adjustment
		| Key               | Value            |
		| AdAdjustmentsName | Agency Surcharge |

Scenario: Verify update ad adjustments for media asset
	Given I am on the Staff site as designated user Staff
	When I updated ad adjustments for media asset ACRP Online
		| Key                  | Value            |
		| ProductCode          | AsscCEOGuide     |
		| OldAdAdjustmentsName | Agency Surcharge |
		| AdAdjustmentsName    | Special Rates    |
		| isAmount             | false            |
		| isSurcharge          | true             |
		| AdAdjustmentTarget   | Running Total    |
		| AdAdjustmentValue    | 15               |
	Then I verify inserted ad adjustment
		| Key               | Value         |
		| AdAdjustmentsName | Special Rates |

Scenario: Verify delete ad adjustments for media asset
	Given I am on the Staff site as designated user Staff
	When I remove ad adjustments for media asset ACRP Online
		| Key                  | Value         |
		| ProductCode          | AsscCEOGuide  |
		| OldAdAdjustmentsName | Special Rates |
		| AdAdjustmentsName    | Special Rates |
		| isAmount             | false         |
		| isSurcharge          | true          |
		| AdAdjustmentTarget   | Running Total |
		| AdAdjustmentValue    | 15            |
	Then I verify removed ad adjustments
		| Key                  | Value         |
		| OldAdAdjustmentsName | Special Rates |
`

export const CodeView : Component<{code: string }> = (props) =>{
    const x= hljs.highlight(code,{
        language: 'gherkin'
    }).value;

    return <div class='m-4 p-4 rounded-md bg-neutral-500yes' >
        <pre class='whitespace-pre' innerHTML={x}>
        </pre>
    </div>
}
export const StackDump : Component<{test: UnitTest }> = (props) =>{
    return <><a href={'#' + props.test.test_name} class="block mb-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-red-500">{props.test.test_name}</h5>
                <div class='w-full overflow-x-scroll'>
                    <pre class="font-normal text-gray-700 dark:text-gray-400 overflow-wrap">
                        {props.test.error}
                    </pre>
                    <pre class="font-normal text-gray-700 dark:text-gray-400 overflow-wrap ">
                        {props.test.stack}
                    </pre></div></a></>
}

// in our og, we are defining a step as an image.
export const ImageBrowser : Component<{name: string, step: Step[] }> = (props) =>{
    const [log, showLog] = createSignal(false)
    const [path, setPath] = createSignal(props.step[0])
    const scr = () => `TestResults/${path().screen}`

    return <div>
        <a id={props.name}> <h3 class="text-2xl font-bold dark:text-white pt-4 pb-2">{props.name}</h3></a>
        <button
            class='cursor-pointer text-blue-700 hover: text-blue:600' onClick={() => { showLog(!log()) }} >Show Log</button>

        <div class="relative overflow-x-auto shadow-md sm:rounded-lg pt-4 flex flex-row" >
            <div class='flex-none'>
                <a target='blank' href={scr()} ><img class=' mr-2 h-96' src={scr()} alt={path().name} loading="lazy" /></a>

            </div>
            <div class='flex-1'>
                <For each={props.step}>{(e, i) => {
                    return <div><a class='text-blue-700 hover:text-blue-600 cursor-pointer' onClick={
                        () => { setPath(e) }
                    }>{e.name}</a></div>
                }}</For></div>

        </div></div>
}


export const TestView : Component<{id: string}> = (props)=>{
    // <StackDump test={props.test}/>
    //         <ImageBrowser name={''} step={[]}/>
    //
    return <>
        <Nav/>
        <CodeView code={code}/>
    </>
}