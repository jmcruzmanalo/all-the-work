import { takeLatest, call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import {
  SET_ACTIVE_SERVER_PASSWORD_STATUS,
  CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD
} from '../../redux/modules/server';
import { getServerId, getEnteredPassword } from '../../redux/selectors';

const verifyPassword = async ({ serverId, password }) => {
  const response = await axios.post(
    `/api/servers/${serverId}/rolesRating/verifyPassword`,
    { password }
  );
  return response.data;
};

export function* checkServerRatingEditPassword(action) {
  yield put({
    type: SET_ACTIVE_SERVER_PASSWORD_STATUS,
    payload: 'LOADING'
  });
  yield call(delay, 500);
  const serverId = yield select(getServerId);
  const password = yield select(getEnteredPassword);
  const res = yield call(verifyPassword, { serverId, password });
  yield put({
    type: SET_ACTIVE_SERVER_PASSWORD_STATUS,
    payload: res.isValid ? 'VALID' : 'INVALID'
  });
}

export function* watchForPasswordEntry() {
  yield takeLatest(
    CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD,
    checkServerRatingEditPassword
  );
}
