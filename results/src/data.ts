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
