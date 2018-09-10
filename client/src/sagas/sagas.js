import * as actionTypes from '../actions/actionTypes';
import { all, fork, call, select, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  getServerId,
  getServerRatingEditValues,
  getEnteredPassword
} from '../reducers/selectors';
import { watchForPasswordEntry } from './serverEditSagas/watchPasswordEntry';

// Roles Rating

// TODO: The params need to be placed at the store?
// const getServerRolesRating = async ({ serverId }) => {
//   const results = await axios.get(`/api/servers/${serverId}/rolesRating`);
//   console.log(results);
// }

// function* fetchServerRolesRating() {
//   const serverId = yield select(getServerId);
//   const result = yield call(getServerRolesRating, { serverId });
// }

// Server Details
const getServerDetails = async ({ serverId }) => {
  const response = await axios.get(`/api/servers/${serverId}/details`, {
    params: {
      getMembers: true,
      getRolesRating: true
    }
  });
  return response.data;
};

function* fetchServerDetails() {
  const serverId = yield select(getServerId);
  const data = yield call(getServerDetails, { serverId });
}

export const sendServerEditDetails = async (
  serverId,
  serverEditPassword,
  serverEditData
) => {
  const url = `/api/servers/${serverId}/requestUpdateRolesRating`;
  const postRequest = axios.post(url, {
    serverEditData,
    password: serverEditPassword
  });
  return await postRequest;
};

export function* submitServerRatingEdit() {
  // Get the form data first
  const serverRatingEditValues = yield select(getServerRatingEditValues);
  const serverId = yield select(getServerId);
  const serverEditPassword = yield select(getEnteredPassword);
  const response = yield call(
    sendServerEditDetails,
    serverId,
    serverEditPassword,
    serverRatingEditValues
  );
  // Dispatch a success call?

  console.log(response);
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchServerActiveSet() {
  yield takeLatest(actionTypes.SET_ACTIVE_SERVER, fetchServerDetails);
}

function* watchServerEditSubmit() {
  yield takeLatest(
    actionTypes.SUBMIT_SERVER_ROLES_RATING_EDIT,
    submitServerRatingEdit
  );
}

export default function* rootSaga() {
  yield all([
    fork(watchServerActiveSet),
    fork(watchServerEditSubmit),
    fork(watchForPasswordEntry)
  ]);
}
