import Toast from 'react-native-simple-toast';

import axios from 'axios';
import baseServerURL from '../../baseServerURL';

import {
  storeJWT,
  storeShopId,
  storeUserId,
  storeUserRole,
} from '../../asyncStorage';

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
  REGISTER_EMAIL_INVALID_CHANGED,
  REGISTER_PASSWORD_INVALID_CHANGED,
  REGISTER_CONFIRM_PASSWORD_INVALID_CHANGED,
  REGISTER_NAME_INVALID_CHANGED,
  SIGNUP_ERROR_CHANGED,
  LOGIN_EMAIL_INVALID_CHANGED,
  LOGIN_PASSWORD_INVALID_CHANGED,
  SIGN_OUT,
} from '../types';

import * as RootNavigation from '../../RootNavigation';

export const loginEmailChanged = (text) => {
  return {
    type: LOGIN_EMAIL_CHANGED,
    payload: text,
  };
};

export const loginPasswordChanged = (text) => {
  return {
    type: LOGIN_PASSWORD_CHANGED,
    payload: text,
  };
};

export const loginEmailInvalidChanged = (text) => {
  return {
    type: LOGIN_EMAIL_INVALID_CHANGED,
    payload: text,
  };
};

export const loginPasswordInvalidChanged = (text) => {
  return {
    type: LOGIN_PASSWORD_INVALID_CHANGED,
    payload: text,
  };
};

export const registerEmailChanged = (text) => {
  return {
    type: REGISTER_EMAIL_CHANGED,
    payload: text,
  };
};

export const registerPasswordChanged = (text) => {
  return {
    type: REGISTER_PASSWORD_CHANGED,
    payload: text,
  };
};

export const registerConfirmPasswordChanged = (text) => {
  return {
    type: REGISTER_CONFIRM_PASSWORD_CHANGED,
    payload: text,
  };
};

export const registerNameChanged = (text) => {
  return {
    type: REGISTER_NAME_CHANGED,
    payload: text,
  };
};

export const registerEmailInvalidChanged = (text) => {
  return {
    type: REGISTER_EMAIL_INVALID_CHANGED,
    payload: text,
  };
};

export const registerPasswordInvalidChanged = (text) => {
  return {
    type: REGISTER_PASSWORD_INVALID_CHANGED,
    payload: text,
  };
};

export const registerConfirmPasswordInvalidChanged = (text) => {
  return {
    type: REGISTER_CONFIRM_PASSWORD_INVALID_CHANGED,
    payload: text,
  };
};

export const registerNameInalidChanged = (text) => {
  return {
    type: REGISTER_NAME_INVALID_CHANGED,
    payload: text,
  };
};

// for thunk
export const fetchingUserRequest = () => {
  console.log('Dispatch fetching user request');
  return {
    type: FETCHING_USER_REQUEST,
  };
};

export const fetchingUserSuccess = (json) => {
  console.log('Fetch user success');
  storeJWT(json.data.token);
  storeShopId(json.data.shopId);
  storeUserId(json.data.userId);
  storeUserRole(json.data.role);
  return {
    type: FETCHING_USER_SUCCESS,
    payload: json.data,
  };
};

export const fetchingUserFailure = (error) => {
  console.log('Fetch user failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_USER_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchUser = (data) => {
  console.log('fetching user');
  return async (dispatch) => {
    dispatch(fetchingUserRequest());
    try {
      console.log('before endpoint');
      let response = await axios.post(baseServerURL + '/user/signin', {
        email: data.email,
        password: data.password,
      });
      await dispatch(fetchingUserSuccess(response));
      console.log('response', response.data);

      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingUserFailure(err));
    }
  };
};

export const creatingUserRequest = () => {
  console.log('Dispatch creating user request');
  return {
    type: CREATING_USER_REQUEST,
  };
};

export const creatingUserSuccess = (json) => {
  console.log('Create user success');
  console.log(json.data);
  return {
    type: CREATING_USER_SUCCESS,
    payload: json.data,
  };
};

export const creatingUserFailure = (error) => {
  console.log('Create user failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: CREATING_USER_FAILURE,
    payload: error.response.data.message,
  };
};

export const createhUser = (data) => {
  console.log('creating user');
  return async (dispatch) => {
    dispatch(creatingUserRequest());
    try {
      let response = await axios.post(baseServerURL + '/user/signup', {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        shopId: data.shopId,
      });
      dispatch(creatingUserSuccess(response));
      Toast.show('User Created');
      if (data.role != 'staff') {
        RootNavigation.navigate('Login');
      }
    } catch (err) {
      dispatch(creatingUserFailure(err));
    }
  };
};

export const updateJwt = (jwt) => {
  console.log('enter updateJwt');
  return {
    type: UPDATE_JWT,
    payload: jwt,
  };
};

export const removeJwt = () => {
  return {
    type: REMOVE_JWT,
    payload: '',
  };
};

export const updateUserRole = (userRole) => {
  console.log('enter updateUserRole');
  return {
    type: UPDATE_USER_ROLE,
    payload: userRole,
  };
};

export const updateShopId = (shopId) => {
  console.log('enter updateShopId');
  return {
    type: UPDATE_SHOP_ID,
    payload: shopId,
  };
};

export const updateUserId = (userId) => {
  console.log('enter updateUserId');
  return {
    type: UPDATE_USER_ID,
    payload: userId,
  };
};

export const fetchingShopIdRequest = () => {
  console.log('Dispatch fetching fetchingShopIdRequest request');
  return {
    type: FETCHING_SHOPID_REQUEST,
  };
};

export const fetchingShopIdSuccess = (json) => {
  console.log('Fetch ShopId success');
  return {
    type: FETCHING_SHOPID_SUCCESS,
    payload: json.data,
  };
};

export const fetchingShopIdFailure = (error) => {
  console.log('Fetch ShopId failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_SHOPID_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchShopId = (data) => {
  console.log('fetching ShopId');
  return async (dispatch) => {
    dispatch(fetchingShopIdRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(baseServerURL + `/user/${data}`, {});
      await dispatch(fetchingShopIdSuccess(response));
      console.log('response', response.data);

      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingShopIdFailure(err));
    }
  };
};

export const fetchingUserByIdRequest = () => {
  console.log('Dispatch fetching UserById request');
  return {
    type: FETCHING_USER_BY_ID_REQUEST,
  };
};

export const fetchingUserByIdSuccess = (json) => {
  console.log('Fetch UserById success');
  return {
    type: FETCHING_USER_BY_ID_SUCCESS,
    payload: json.data,
  };
};

export const fetchingUserByIdFailure = (error) => {
  console.log('Fetch ShopId failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_USER_BY_ID_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchUserById = (data) => {
  console.log('fetching ShopId');
  return async (dispatch) => {
    dispatch(fetchingUserByIdRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(baseServerURL + `/user/user/${data}`, {});
      await dispatch(fetchingUserByIdSuccess(response));
      console.log('response', response.data);

      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingUserByIdFailure(err));
    }
  };
};

export const allShopActivitiesChanged = (data) => {
  console.log('enter allShopActivitiesChanged', data);
  return {
    type: ALL_SHOP_ACTIVITIES_CHANGED,
    payload: data,
  };
};

export const availableActivitiesChanged = (data) => {
  console.log('enter availableActivitiesChanged', data);
  return {
    type: AVAILABLE_SHOP_ACTIVITIES_CHANGED,
    payload: data,
  };
};

export const currenlyServingActivitiesChanged = (data) => {
  console.log('enter currenlyServingActivitiesChanged', data);
  return {
    type: CURRENTLY_SERVING_SHOP_ACTIVITIES_CHANGED,
    payload: data,
  };
};

export const selectStartActivityChanged = (activity) => {
  console.log('selectStartActivityChanged', activity);
  return {
    type: SELECT_START_ACTIVITY_CHANGED,
    payload: activity,
  };
};

export const selectStopActivityChanged = (activity) => {
  console.log('selectStopActivityChanged', activity);
  return {
    type: SELECT_STOP_ACTIVITY_CHANGED,
    payload: activity,
  };
};

export const updatingStartStopServingRequest = () => {
  console.log('Dispatch StartStopServing request');
  return {
    type: UPDATE_START_STOP_SERVING_REQUEST,
  };
};

export const updatingStartStopServingSuccess = (json) => {
  console.log('StartStopServing success');
  return {
    type: UPDATE_START_STOP_SERVING_SUCCESS,
    payload: json.data,
  };
};

export const updatingStartStopServingFailure = (error) => {
  console.log('StartStopServing failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: UPDATE_START_STOP_SERVING_FAILURE,
    payload: error.response.data.message,
  };
};

export const updateStartStopServing = (data) => {
  console.log('updating StartStopServing');
  return async (dispatch) => {
    dispatch(updatingStartStopServingRequest());
    try {
      console.log('before endpoint');
      let response = await axios.post(
        baseServerURL +
          `/shopStatus/servingStaff/${data.shopId}/?action=${data.action}&activityId=${data.activityId}`,
        {},
        {
          headers: {
            authorization: data.jwt,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      await dispatch(updatingStartStopServingSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(updatingStartStopServingFailure(err));
    }
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
    payload: '',
  };
};
