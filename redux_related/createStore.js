export const createStore = (reducer, enhancer) => {
    if (enhancer) {
        return enhancer(createStore)(reducer)
    }
    let currentState = {}
    let currentListener = []

    function getState() {
        return currentState
    }

    function subscribe(listener) {
        currentListener.push(listener)
    }

    function dispatch(action) {
        currentState = reducer(currentState, action)
        currentListener.forEach(v=>v())
        return action
    }

    dispatch({type: '@@/redux/init'})

    return {getState, subscribe, dispatch}
}