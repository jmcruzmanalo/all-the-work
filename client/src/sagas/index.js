import { all, fork } from 'redux-saga/effects';
import {
  watchServerActiveSet,
  watchServerEditSubmit,
  watchForPasswordEntry
} from './serverEditSagas/server.saga';

export default function* rootSaga() {
  yield all([
    fork(watchServerActiveSet),
    fork(watchServerEditSubmit),
    fork(watchForPasswordEntry)
  ]);
}
