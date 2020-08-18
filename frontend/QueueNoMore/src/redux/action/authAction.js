import axios from 'axios';
import baseServerURL from '../../baseServerURL';

import Toast from 'react-native-simple-toast';

import {storeJWT, retrieveJWT} from '../../asyncStorage';

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

import * as RootNavigation from '../../RootNavigation';

export const loginEmailChanged = text => {
  return {
    type: LOGIN_EMAIL_CHANGED,
    payload: text,
  };
};

export const loginPasswordChanged = text => {
  return {
    type: LOGIN_PASSWORD_CHANGED,
    payload: text,
  };
};

export const loginEmailInvalidChanged = text => {
  return {
    type: LOGIN_EMAIL_INVALID_CHANGED,
    payload: text,
  };
};

export const loginPasswordInvalidChanged = text => {
  return {
    type: LOGIN_PASSWORD_INVALID_CHANGED,
    payload: text,
  };
};

export const registerEmailChanged = text => {
  return {
    type: REGISTER_EMAIL_CHANGED,
    payload: text,
  };
};

export const registerPasswordChanged = text => {
  return {
    type: REGISTER_PASSWORD_CHANGED,
    payload: text,
  };
};

export const registerConfirmPasswordChanged = text => {
  return {
    type: REGISTER_CONFIRM_PASSWORD_CHANGED,
    payload: text,
  };
};

export const registerNameChanged = text => {
  return {
    type: REGISTER_NAME_CHANGED,
    payload: text,
  };
};

export const registerEmailInvalidChanged = text => {
  return {
    type: REGISTER_EMAIL_INVALID_CHANGED,
    payload: text,
  };
};

export const registerPasswordInvalidChanged = text => {
  return {
    type: REGISTER_PASSWORD_INVALID_CHANGED,
    payload: text,
  };
};

export const registerConfirmPasswordInvalidChanged = text => {
  return {
    type: REGISTER_CONFIRM_PASSWORD_INVALID_CHANGED,
    payload: text,
  };
};

export const registerNameInalidChanged = text => {
  return {
    type: REGISTER_NAME_INVALID_CHANGED,
    payload: text,
  };
};

export const signUpErrorChanged = text => {
  return {
    type: SIGNUP_ERROR_CHANGED,
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

export const fetchingUserSuccess = json => {
  console.log('Fetch user success');
  storeJWT(json.data.token);
  const token = retrieveJWT();
  console.log('action', token);
  return {
    type: FETCHING_USER_SUCCESS,
    payload: json.data,
  };
};

export const fetchingUserFailure = error => {
  console.log('Fetch user failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_USER_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchUser = data => {
  console.log('fetching user');
  return async dispatch => {
    dispatch(fetchingUserRequest());
    try {
      console.log('before endpoint');
      let response = await axios.post(baseServerURL + '/user/signin', {
        email: data.email,
        password: data.password,
      });
      await dispatch(fetchingUserSuccess(response));
      console.log('response', response.data);
      RootNavigation.navigate('Home');
    } catch (err) {
      Toast.show('Fail to sign in');
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

export const creatingUserSuccess = json => {
  console.log('Create user success');
  console.log(json.data);
  return {
    type: CREATING_USER_SUCCESS,
    payload: json.data,
  };
};

export const creatingUserFailure = error => {
  console.log('Create user failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: CREATING_USER_FAILURE,
    payload: error.response.data.message,
  };
};

export const createhUser = data => {
  console.log('creating user');
  return async dispatch => {
    dispatch(creatingUserRequest());
    try {
      let response = await axios.post(baseServerURL + '/user/signup', {
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'customer',
      });
      dispatch(creatingUserSuccess(response));
      Toast.show('User Created');
      RootNavigation.navigate('Login');
    } catch (err) {
      Toast.show('Fail to create user');
      dispatch(creatingUserFailure(err));
    }
  };
};

export const updateJwt = jwt => {
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
