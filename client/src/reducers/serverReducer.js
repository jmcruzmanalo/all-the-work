import * as actionTypes from '../actions/actionTypes';

// This is for `server` in redux
// server = sampleState in redux
// const sampleState = {
//   serverId: 'serverId',
//   serverMembers: [],
//   serverRolesRating: {
//   }
// };

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_SERVER:
      console.log('Inside Set Active Server');
      return {
        ...state,
        serverId: action.payload
      };

    case actionTypes.FETCH_SERVER_MEMBERS_DONE:
      return {
        ...state,
        serverMembers: action.payload
      };

    case actionTypes.SET_SERVER_TRN_ROLES_RATING:
      return {
        ...state
      };

    default:
      return state;
  }
};
