import { initialize } from 'redux-form';
import { all, fork, call, select, takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';
import {
  getServerId,
  getServerRatingEditValues,
  getEnteredPassword
} from '../redux/selectors';
import { watchForPasswordEntry } from './serverEditSagas/watchPasswordEntry';
import {
  SET_ACTIVE_SERVER,
  SUBMIT_SERVER_ROLES_RATING_EDIT
} from '../redux/modules/server';

// Server Details
const getServerDetails = async ({ serverId }) => {
  try {
    const response = await axios.get(`/api/servers/${serverId}/details`, {
      params: {
        getMembers: true,
        getRolesRating: true
      }
    });
    return response.data;
  } catch (e) {
    const status = e.request.status;
    console.log(`Could not connect to server - status ${status}`);
    return false;
  }
};

function* fetchServerDetails() {
  const serverId = yield select(getServerId);
  const data = yield call(getServerDetails, { serverId });
  if (data) {
    yield put(
      initialize('serverRatingEdit', {
        ratingType: data.ratingType,
        rolesRating: data.rolesRating
      })
    );
  } else {
    console.log('Dispatch a "could not connect to server"');
  }
}

export const sendServerEditDetails = async (
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
  yield takeLatest(SET_ACTIVE_SERVER, fetchServerDetails);
}

function* watchServerEditSubmit() {
  yield takeLatest(SUBMIT_SERVER_ROLES_RATING_EDIT, submitServerRatingEdit);
}

export default function* rootSaga() {
  yield all([
    fork(watchServerActiveSet),
    fork(watchServerEditSubmit),
    fork(watchForPasswordEntry)
  ]);
}
