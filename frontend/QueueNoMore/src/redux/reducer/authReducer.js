import {
  LOGIN_EMAIL_CHANGED,
  LOGIN_PASSWORD_CHANGED,
  REGISTER_EMAIL_CHANGED,
  REGISTER_PASSWORD_CHANGED,
  REGISTER_CONFIRM_PASSWORD_CHANGED,
  REGISTER_NAME_CHANGED,
  FETCHING_USER_REQUEST,
  FETCHING_USER_SUCCESS,
  FETCHING_USER_FAILURE,
  CREATING_USER_REQUEST,
  CREATING_USER_SUCCESS,
  CREATING_USER_FAILURE,
  UPDATE_JWT,
  REMOVE_JWT,
  REGISTER_EMAIL_INVALID_CHANGED,
  REGISTER_PASSWORD_INVALID_CHANGED,
  REGISTER_CONFIRM_PASSWORD_INVALID_CHANGED,
  REGISTER_NAME_INVALID_CHANGED,
  SIGNUP_ERROR_CHANGED,
  LOGIN_EMAIL_INVALID_CHANGED,
  LOGIN_PASSWORD_INVALID_CHANGED,
} from '../types';

const INITIAL_STATE = {
  login_email: '',
  login_password: '',
  login_email_invalid: '',
  login_password_invalid: '',
  register_email: '',
  register_password: '',
  register_confirmPassword: '',
  register_name: '',
  register_email_inValid: '',
  register_password_inValid: '',
  register_confirmPassword_inValid: '',
  register_name_inValid: '',
  isFetching: false,
  login_Error: '',
  isCreating: false,
  register_Error: '',
  loading: false,
  user: {},
  userId: '',
  jwt: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_EMAIL_CHANGED:
      return {...state, login_email: action.payload};
    case LOGIN_PASSWORD_CHANGED:
      return {...state, login_password: action.payload};
    case LOGIN_EMAIL_INVALID_CHANGED:
      return {...state, login_email_invalid: action.payload};
    case LOGIN_PASSWORD_INVALID_CHANGED:
      return {...state, login_password_invalid: action.payload};
    case REGISTER_EMAIL_CHANGED:
      return {...state, register_email: action.payload};
    case REGISTER_PASSWORD_CHANGED:
      return {...state, register_password: action.payload};
    case REGISTER_CONFIRM_PASSWORD_CHANGED:
      return {...state, register_confirmPassword: action.payload};
    case REGISTER_NAME_CHANGED:
      return {...state, register_name: action.payload};
    case REGISTER_EMAIL_INVALID_CHANGED:
      return {...state, register_email_inValid: action.payload};
    case REGISTER_PASSWORD_INVALID_CHANGED:
      return {...state, register_password_inValid: action.payload};
    case REGISTER_CONFIRM_PASSWORD_INVALID_CHANGED:
      return {...state, register_confirmPassword_inValid: action.payload};
    case REGISTER_NAME_INVALID_CHANGED:
      return {...state, register_name_inValid: action.payload};
    case FETCHING_USER_REQUEST:
      return {...state, isFetching: true};
    case FETCHING_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        userId: action.payload.userId,
        jwt: 'Bearer ' + action.payload.token,
        login_Error: '',
        login_email: '',
        login_password: '',
      };
    case FETCHING_USER_FAILURE:
      return {...state, isFetching: false, login_Error: action.payload};
    case CREATING_USER_REQUEST:
      return {...state, isCreating: true};
    case CREATING_USER_SUCCESS:
      return {
        ...state,
        isCreating: false,
        login_email: action.payload.email,
        register_email: '',
        register_password: '',
        register_confirmPassword: '',
        register_name: '',
        register_Error: '',
      };
    case CREATING_USER_FAILURE:
      return {...state, isCreating: false, register_Error: action.payload};
    case UPDATE_JWT:
      return {...state, jwt: action.payload};
    case REMOVE_JWT:
      return {...state, jwt: ''};
    default:
      return state;
  }
};
