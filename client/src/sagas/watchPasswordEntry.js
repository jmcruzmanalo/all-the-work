import * as actionTypes from '../actions/actionTypes';
import { takeLatest, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';

const verifyPassword = async password => {
  const isPasswordValid = axios.get();
};

export function* checkServerRatingEditPassword() {
  yield call(delay, 200);
  console.log('Test');
}

export function* watchForPasswordEntry() {
  yield takeLatest(
    actionTypes.CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD,
    checkServerRatingEditPassword
  );
}
