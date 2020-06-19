import React, {Suspense, lazy} from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'

const MyPage = lazy(() => import('./components/MyPage/index'))
const Login = lazy(() => import('./components/Login/login'))
const onLogin = lazy(() => import('./components/Login/onlogin'))
const Projects = lazy(() => import('./components/Projects/ongoingprojects'))
const ProjectDetails = lazy(() => import('./components/Projects/projectdetails'))
const IssueComments = lazy(() => import('./components/Issues/issues'))
const newProject = lazy(() => import('./components/Projects/newproject'))

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading ...</div>}>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/onlogin' component={onLogin}/>
        <Route exact path='/mypage' component={MyPage}/>
        <Route exact path='/projects' component={Projects}/>
        <Route exact path="/projects/:id" component={ProjectDetails} />
        <Route exact path="/issues/:id" component={IssueComments} />
        <Route exact path="/project/add" component={newProject} />
      </Switch>
    </Suspense>
  </Router>
)

export default App;