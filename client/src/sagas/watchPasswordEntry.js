import * as actionTypes from '../actions/actionTypes';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import { getServerId, getEnteredPassword } from '../reducers/selectors';

const verifyPassword = async ({ serverId, password }) => {
  const response = await axios.post(
    `/api/servers/${serverId}/rolesRating/verifyPassword`,
    { password }
  );
  return response.data;
};

export function* checkServerRatingEditPassword(action) {
  yield call(delay, 200);
  const serverId = yield select(getServerId);
  const password = yield select(getEnteredPassword);
  const res = yield call(verifyPassword, { serverId, password });
  yield put({
    type: actionTypes.SET_ACTIVE_SERVER_PASSWORD_VALIDITY,
    payload: res.isValid
  });
}

export function* watchForPasswordEntry() {
  yield takeLatest(
    actionTypes.CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD,
    checkServerRatingEditPassword
  );
}
