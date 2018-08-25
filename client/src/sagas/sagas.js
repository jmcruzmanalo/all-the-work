import * as actionTypes from '../actions/actionTypes';
import { fork, put, all, call, select, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { getServerId } from '../reducers/selectors';



// Roles Rating

// TODO: The params need to be placed at the store?
const getServerRolesRating = async ({ serverId }) => {
  const results = await axios.get(`/api/servers/${serverId}/rolesRating`);
  console.log(results);
}

function* fetchServerRolesRating() {
  const serverId = yield select(getServerId);
  const result = yield call(getServerRolesRating, { serverId });
}


// Server Details
const getServerDetails = async ({ serverId }) => {
  const response = await axios.get(`/api/servers/${serverId}/details`, {
    params: {
      getMembers: true,
      getRolesRating: true
    }
  });
  console.log(response);
  return response;
}

function* fetchServerDetails() {
  const serverId = yield select(getServerId);
  const result = yield call(getServerDetails, { serverId });
}

function* watchServerActiveSet() {
  yield takeLatest(actionTypes.SET_ACTIVE_SERVER, fetchServerDetails);
}

export default function* rootSaga() {
  yield all([
    fork(watchServerActiveSet)
  ])
}
