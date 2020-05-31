import React, {Suspense, lazy} from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'

const MyPage = lazy(() => import('./components/MyPage/index'))
const Login = lazy(() => import('./components/Login/login'))
const onLogin = lazy(() => import('./components/Login/onlogin'))

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading ...</div>}>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/onlogin/' component={onLogin}/>
      </Switch>
    </Suspense>
  </Router>
)

export default App;