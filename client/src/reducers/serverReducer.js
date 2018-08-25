import * as actionTypes from '../actions/actionTypes';

// This is for `server` in redux
// server = sampleState in redux
const sampleState = {
  serverId: 'serverId',
  serverMembers: [],
  serverRolesRating: {

  }
};

export default (state = null, action) => {
  switch (action.type) {

    case actionTypes.SET_ACTIVE_SERVER:
    return {
      ...state,
      serverId: action.payload
    }

    case 'FETCH_SERVER_MEMBERS_DONE':
      return {
        ...state,
        serverMembers: action.payload
      }


    default: return state;
  }
}