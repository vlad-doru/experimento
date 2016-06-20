import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import create from './modules/create'
import repository from './modules/repository'
import simulation from './modules/simulation'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add reducers here
    create,
    repository,
    router,
    simulation,
  })
}

export default makeRootReducer
