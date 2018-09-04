import * as actionTypes from '../actions/actionTypes';
import { fork, all, call, select, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { getServerId, getServerRatingEditValues } from '../reducers/selectors';

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
  return response;
};

function* fetchServerDetails() {
  const serverId = yield select(getServerId);
  const result = yield call(getServerDetails, { serverId });
}

function* watchServerActiveSet() {
  yield takeLatest(actionTypes.SET_ACTIVE_SERVER, fetchServerDetails);
}

export const sendServerEditDetails = async (serverId, serverEditData) => {
  const url = `/api/servers/${serverId}/requestUpdateRolesRating`;
  const postRequest = axios.post(url, serverEditData);
  return await postRequest;
};

export function* submitServerRatingEdit() {
  // Get the form data first
  const serverRatingEditValues = yield select(getServerRatingEditValues);
  const serverId = yield select(getServerId);
  const response = yield call(
    sendServerEditDetails,
    serverId,
    serverRatingEditValues
  );
  // Dispatch a success call?

  console.log(response);
}

function* watchServerEditSubmit() {
  yield takeLatest(
    actionTypes.SUBMIT_SERVER_ROLES_RATING_EDIT,
    submitServerRatingEdit
  );
}

export default function* rootSaga() {
  yield all([watchServerActiveSet(), watchServerEditSubmit()]);
}
