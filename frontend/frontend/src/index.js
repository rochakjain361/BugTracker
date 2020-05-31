/*import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import rootReducers from './reducers/index'
import MyPage from './components/MyPage/index';

export default class AppRouter extends Component{
  constructor (props) {
    super(props)
    this.store = createStore(rootReducers, applyMiddleware(thunk))
  }

  render() {
    const { match } = this.props
    return (
      <Provider store={this.store}>
        <Route path={`${match.path}/`} component={MyPage}/>
      </Provider>
    )
  }
}
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'semantic-ui-css/semantic.min.css'
import store from './store'
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();