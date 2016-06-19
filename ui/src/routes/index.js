// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import NewExperiment from '../containers/NewExperiment'
import ListExperiments from '../containers/ListExperiments'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: {
    component: ListExperiments,
  },
  childRoutes: [
    {
       path: '/create',
       component: NewExperiment,
    },
  ]
})

export default createRoutes
