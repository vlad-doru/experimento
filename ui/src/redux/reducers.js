import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import create from './modules/create'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add reducers here
    create,
    router,
  })
}

export default makeRootReducer
