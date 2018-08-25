import registerServiceWorker from './registerServiceWorker';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleWare from 'redux-saga';
import rootSaga from './sagas/sagas';


import './index.css';

import reducers from './reducers';
import App from './components/App';


// REDUX Dev tools
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;


const sagaMiddleWare = createSagaMiddleWare();
const store = createStore(
  reducers,
  {},
  composeEnhancers(
    applyMiddleware(sagaMiddleWare)
  )
);
sagaMiddleWare.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
