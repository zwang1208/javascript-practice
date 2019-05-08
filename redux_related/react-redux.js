import React from 'react'
import PropTypes from 'prop-types'

export class Provider extends React.Component {
    static childContextType = {
        store: PropTypes.object
    }
    constructor(props, context) {
        super(props, context)
        this.store = props.store
    }
    getChildContext() {
        return {store: this.store}
    }
    render() {
        return this.props.children
    }
}

export const connect = (mapStateToProps=state=>state, mapDispatchToProps={}) => (WrapComponent) => {
    return class ConnectComponent extends React.Component {
        static contextTypes = {
            store: PropTypes.object
        }
        constructor(props, context) {
            super(props, context)
            this.state = {
                props: {}
            }
        }
        componentDidMount() {
            const {store} = this.context
            store.subscribe(()=>this.update())
            this.update()
        }
        update() {
            const {store} = this.context
            const stateProps = mapStateToProps(store.getState())
            const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
            this.setState({
                props: {
                    ...this.state.props,
                    ...stateProps,
                    ...dispatchProps
                }
            })
        }
        render() {
            return <WrapComponent {...this.state.props}></WrapComponent>
        }
    }
} 

const bindActionCreator = (creator, dispatch) => {
    return (...args) => dispatch(creator(...args))
}

const bindActionCreators = (creators, dispatch) => {
    return Object.keys(creators).reduce((acc, item)=> {
        acc[item] = bindActionCreator(creators[items], dispatch)
        return acc
    }, {})
}

export const applyMiddleware = (...middlewares) => {
    return createStore => (...args) => {
        const store = createStore(...args)
        let dispatch = store.dispatch

        const midApi = {
            getState: store.getState,
            dispatch
        }
        // dispatch = middleware(midApi)(store.dispatch)
        const middlewareChain = middlewares.map(middleware=>{
            middleware(midApi)
        })
        dispatch = compose(...middlewareChain)(store.dispatch)
        return {
            ...store,
            dispatch
        }
    }
}

export const compose = (...func) => {
    if(func.length == 0) {
        return arg => arg
    }
    if(func.length == 1) {
        return func[0]
    }
    return func.reduce((acc,item)=>(...args)=>acc(item(...args)))
}