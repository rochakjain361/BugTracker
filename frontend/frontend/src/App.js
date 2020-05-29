import React, {Suspense, lazy} from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'

const MyPage = lazy(() => import('./components/MyPage/index'))

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading ...</div>}>
      <Switch>
        <Route exact path='/' component={MyPage}/>
      </Switch>
    </Suspense>
  </Router>
)

export default App;
