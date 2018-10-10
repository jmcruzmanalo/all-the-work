import { initialize } from 'redux-form';
import {delay} from 'redux-saga';
import { call, select, takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';
import has from 'lodash/has';
import {
  getServerId,
  getServerRatingEditValues,
  getEnteredPassword
} from '../../redux/selectors';
import {
  SET_ACTIVE_SERVER,
  SET_ACTIVE_SERVER_PASSWORD_STATUS,
  CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD,
  SUBMIT_SERVER_ROLES_RATING_EDIT,
  toggleFetchingServerDetails,
  setError
} from '../../redux/modules/server';

/****************************** API Calls *************************************/
const getServerDetails = async ({ serverId }) => {
  const response = await axios.get(`/api/servers/${serverId}/details`, {
    params: {
      getMembers: true,
      getRolesRating: true
    }
  });
  return response.data;
};

const verifyPassword = async ({ serverId, password }) => {
  const response = await axios.post(
    `/api/servers/${serverId}/rolesRating/verifyPassword`,
    { password }
  );
  return response.data;
};

const sendServerEditDetails = async (
  serverId,
  serverEditPassword,
  serverRatingEditValues
) => {
  if ((!serverId, !serverEditPassword, !serverRatingEditValues))
    throw new Error(`Incomplete params`);

  const url = `/api/servers/${serverId}/requestUpdateRolesRating`;
  const postRequest = axios.post(url, {
    serverRatingEditValues,
    password: serverEditPassword
  });
  const response = await postRequest;
  return response.data;
};

/***************************** Subroutines ************************************/
function* fetchServerDetails() {
  try {
    const serverId = yield select(getServerId);
    const data = yield call(getServerDetails, { serverId });
    if (data && (data.ratingType || data.rolesRating.length)) {
      yield put(
        initialize('serverRatingEdit', {
          ratingType: data.ratingType,
          rolesRating: data.rolesRating,
          removedRolesRating: []
        })
      );
    }
    yield put(toggleFetchingServerDetails());
  } catch (e) {
    if (has(e, 'response.data.errorMessage')) {
      yield put(setError(e.response.data.errorMessage));
    } else {
      yield put(setError('Could not connect to server'));
    }
  }
}

function* submitServerRatingEdit() {

  // Set the submit button to loading state
  yield put({
    type: SET_ACTIVE_SERVER_PASSWORD_STATUS,
    payload: 'LOADING'
  });

  // Get the form data first
  const serverRatingEditValues = yield select(getServerRatingEditValues);
  const serverId = yield select(getServerId);
  const serverEditPassword = yield select(getEnteredPassword);
  const data = yield call(
    sendServerEditDetails,
    serverId,
    serverEditPassword,
    serverRatingEditValues
  );
  // Dispatch a success call?

  if (data) {
    yield put(
      initialize('serverRatingEdit', {
        ratingType: data.ratingType,
        rolesRating: data.rolesRating
      })
    );
  }
  yield put({
    type: SET_ACTIVE_SERVER_PASSWORD_STATUS,
    payload: 'VALID'
  });
}

function* checkServerRatingEditPassword(action) {
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

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

export function* watchServerActiveSet() {
  yield takeLatest(SET_ACTIVE_SERVER, fetchServerDetails);
}

export function* watchServerEditSubmit() {
  yield takeLatest(SUBMIT_SERVER_ROLES_RATING_EDIT, submitServerRatingEdit);
}

export function* watchForPasswordEntry() {
  yield takeLatest(
    CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD,
    checkServerRatingEditPassword
  );
}
