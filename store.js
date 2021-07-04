// import { useMemo } from 'react'
// import { createStore, applyMiddleware,combineReducers } from 'redux'
// import { composeWithDevTools } from 'redux-devtools-extension'
// import thunkMiddleware from 'redux-thunk'
// // import reducers from './reducers'
// import { portfolioListReducer } from "./reducers/portfolioReducers"
// import { HYDRATE, createWrapper } from 'next-redux-wrapper'
// import { tagListReducer } from "./reducers/tagReducers"
// let store


// const combinedReducer = combineReducers({
//   tagList: tagListReducer,
//   portfolioList: portfolioListReducer,
// })

// const reducer = (state, action) => {
//   if (action.type === HYDRATE) {
//     const nextState = {
//       ...state, // use previous state
//       ...action.payload, // apply delta from hydration
//     }
//     if (state.count.count) nextState.count.count = state.count.count // preserve count value on client side navigation
//     return nextState
//   } else {
//     return combinedReducer(state, action)
//   }
// }

// function initStore(initialState) {
//   return createStore(
//     reducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(thunkMiddleware))
//   )
// }

// export const initializeStore = (preloadedState) => {
//   let _store = store ?? initStore(preloadedState)

//   // After navigating to a page with an initial Redux state, merge that state
//   // with the current state in the store, and create a new store
//   if (preloadedState && store) {
//     _store = initStore({
//       ...store.getState(),
//       ...preloadedState,
//     })
//     // Reset the current store
//     store = undefined
//   }

//   // For SSG and SSR always create a new store
//   if (typeof window === 'undefined') return _store
//   // Create the store once in the client
//   if (!store) store = _store

//   return _store
// }

// export function useStore(initialState) {
//   const store = useMemo(() => initializeStore(initialState), [initialState])
//   return store
// }


// export const wrapper = createWrapper(initStore)
import { useMemo } from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import thunkMiddleware from 'redux-thunk'
import { portfolioListReducer } from "./reducers/portfolioReducers"
import { tagListReducer } from "./reducers/tagReducers"
const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

const combinedReducer = combineReducers({
   tagList: tagListReducer,
   portfolioList: portfolioListReducer,
})

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    //console.log(action.payload)
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
  //    if (state.count.count) nextState.count.count = state.count.count // preserve count value on client side navigation
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

export const useStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]))
}

// export function useStore(initialState) {
//   const store = useMemo(() => initializeStore(initialState), [initialState])
//   return store
// }
export const wrapper = createWrapper(useStore)