import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleWare from 'redux-saga';
import rootSaga from '../sagas/sagas';
import { reducer as formsReducer } from 'redux-form';
import serverReducer from './modules/server';

// REDUX Dev tools
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const composeEnhancers =
  window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;

const reducers = combineReducers({
  server: serverReducer,
  form: formsReducer
});

const sagaMiddleWare = createSagaMiddleWare();
const store = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(sagaMiddleWare))
);
sagaMiddleWare.run(rootSaga);

export default store;
