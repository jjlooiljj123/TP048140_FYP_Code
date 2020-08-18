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
  UPDATE_USER_ROLE,
  UPDATE_SHOP_ID,
  UPDATE_USER_ID,
  FETCHING_SHOPID_REQUEST,
  FETCHING_SHOPID_SUCCESS,
  FETCHING_SHOPID_FAILURE,
  FETCHING_USER_BY_ID_REQUEST,
  FETCHING_USER_BY_ID_SUCCESS,
  FETCHING_USER_BY_ID_FAILURE,
  ALL_SHOP_ACTIVITIES_CHANGED,
  AVAILABLE_SHOP_ACTIVITIES_CHANGED,
  CURRENTLY_SERVING_SHOP_ACTIVITIES_CHANGED,
  SELECT_START_ACTIVITY_CHANGED,
  SELECT_STOP_ACTIVITY_CHANGED,
  UPDATE_START_STOP_SERVING_REQUEST,
  UPDATE_START_STOP_SERVING_SUCCESS,
  UPDATE_START_STOP_SERVING_FAILURE,
  SIGN_OUT,
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
  isCreating: false,
  login_Error: '',
  register_Error: '',
  loading: false,
  user: {},
  userId: '',
  jwt: '',
  shopId: '',
  userRole: '',
  isFetchingShopId: false,
  fetchingShopIdError: '',
  isFetchingUserById: false,
  fetchingUserByIdError: '',
  allShopActivities: [],
  availableShopActivities: [],
  currentlyServingActivities: [],
  selectStartActivity: '',
  selectStopActivity: '',
  isUpdatingStartStopServing: false,
  UpdatingStartStopServingError: '',
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
        userRole: action.payload.role,
        shopId: action.payload.shopId,
        login_Error: '',
        login_email: '',
        login_password: '',
      };
    case FETCHING_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        login_Error: action.payload,
        jwt: null,
      };
    case CREATING_USER_REQUEST:
      return {...state, isCreating: true};
    case CREATING_USER_SUCCESS:
      return {
        ...state,
        isCreating: false,
        // email: action.payload.email,
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
    case UPDATE_SHOP_ID:
      return {...state, shopId: action.payload};
    case UPDATE_USER_ID:
      return {...state, userId: action.payload};
    case UPDATE_USER_ROLE:
      return {...state, userRole: action.payload};
    case FETCHING_SHOPID_REQUEST:
      return {...state, isFetchingShopId: true};
    case FETCHING_SHOPID_SUCCESS:
      return {...state, isFetchingShopId: false, shopId: action.payload.shopId};
    case FETCHING_SHOPID_FAILURE:
      return {
        ...state,
        isFetchingShopId: false,
        fetchingShopIdError: action.payload,
      };
    case FETCHING_USER_BY_ID_REQUEST:
      return {...state, isFetchingUserById: true};
    case FETCHING_USER_BY_ID_SUCCESS:
      return {
        ...state,
        isFetchingUserById: false,
        user: action.payload.user,
        fetchingUserByIdError: '',
      };
    case FETCHING_USER_BY_ID_FAILURE:
      return {
        ...state,
        isFetchingUserById: false,
        fetchingUserByIdError: action.payload,
      };
    case ALL_SHOP_ACTIVITIES_CHANGED:
      return {...state, allShopActivities: action.payload};
    case AVAILABLE_SHOP_ACTIVITIES_CHANGED:
      return {...state, availableShopActivities: action.payload};
    case CURRENTLY_SERVING_SHOP_ACTIVITIES_CHANGED:
      return {...state, currentlyServingActivities: action.payload};
    case SELECT_START_ACTIVITY_CHANGED:
      return {...state, selectStartActivity: action.payload};
    case SELECT_STOP_ACTIVITY_CHANGED:
      return {...state, selectStopActivity: action.payload};
    case UPDATE_START_STOP_SERVING_REQUEST:
      return {
        ...state,
        isUpdatingStartStopServing: true,
      };
    case UPDATE_START_STOP_SERVING_SUCCESS:
      return {
        ...state,
        isUpdatingStartStopServing: false,
        UpdatingStartStopServingError: '',
        user: action.payload.user,
        currentlyServingActivities: action.payload.currentlyServingActivities,
        availableShopActivities: action.payload.availableShopActivities,
        selectStartActivity: action.payload.availableShopActivities[0],
        selectStopActivity: action.payload.currentlyServingActivities[0],
      };
    case UPDATE_START_STOP_SERVING_FAILURE:
      return {
        ...state,
        isUpdatingStartStopServing: false,
        UpdatingStartStopServingError: action.payload,
      };
    case SIGN_OUT:
      return {...state, userId: '', jwt: '', userRole: '', shopId: ''};
    default:
      return state;
  }
};
