/**
 * ACTION TYPES
 */

export const SET_ACTIVE_SERVER = 'SET_ACTIVE_SERVER';
export const SET_ACTIVE_SERVER_PASSWORD_STATUS =
  'SET_ACTIVE_SERVER_PASSWORD_VALIDITY';

export const FETCH_SERVER_ROLES_RATING = 'FETCH_SERVER_ROLES_RATING';
export const SET_SERVER_RATING_EDIT_DEFAULTS =
  'SET_SERVER_RATING_EDIT_DEFAULTS';

export const SUBMIT_SERVER_ROLES_RATING_EDIT =
  'SUBMIT_SERVER_ROLES_RATING_EDIT';
export const CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD =
  'CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD';

/**
 * ACTION CREATORS
 */

export const setActiveServer = serverId => {
  return {
    type: SET_ACTIVE_SERVER,
    payload: serverId
  };
};

export const fetchServerMembers = () => {
  return {
    type: 'FETCH_SERVER_MEMBERS'
  };
};

export const fetchServerRolesRating = () => {
  return {
    type: FETCH_SERVER_ROLES_RATING
  };
};

export const checkServerRolesRatingEditPassword = () => {
  return {
    type: CHECK_SERVER_ROLES_RATING_EDIT_PASSWORD
  };
};

export const submitServerRatingEdit = () => {
  return {
    type: SUBMIT_SERVER_ROLES_RATING_EDIT
  };
};

/**
 * REDUCER
 */

export default (state = null, action) => {
  switch (action.type) {
    case SET_ACTIVE_SERVER:
      return {
        ...state,
        serverId: action.payload
      };

    case SET_ACTIVE_SERVER_PASSWORD_STATUS:
      return {
        ...state,
        serverEditPasswordStatus: action.payload
      };

    case SET_SERVER_RATING_EDIT_DEFAULTS:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};
