import axios from 'axios';
import baseServerURL from '../../baseServerURL';

import {
  FETCHING_SHOP_STATUS_REQUEST,
  FETCHING_SHOP_STATUS_SUCCESS,
  FETCHING_SHOP_STATUS_FAILURE,
  TIME_TO_CLEAR_QUEUE_CHANGED,
  UPDATE_SERVER_REQURIED_IO,
  UPDATE_CLEAR_QUEUE_TIME_REQUEST,
  UPDATE_CLEAR_QUEUE_TIME_SUCCESS,
  UPDATE_CLEAR_QUEUE_TIME_FAILURE,
} from '../types';

import * as RootNavigation from '../../RootNavigation';

export const fetchingShopStatusRequest = () => {
  console.log('Dispatch fetchingShopStatus request');
  return {
    type: FETCHING_SHOP_STATUS_REQUEST,
  };
};

export const fetchingShopStatusSuccess = (json) => {
  console.log('Fetch fetchingShopStatus success');
  return {
    type: FETCHING_SHOP_STATUS_SUCCESS,
    payload: json.data,
  };
};

export const fetchingShopStatusFailure = (error) => {
  console.log('Fetch fetchingShopStatus failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_SHOP_STATUS_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchingShopStatus = (data) => {
  console.log('fetching fetchingShopStatus ');
  console.log('shopId, ', data);
  return async (dispatch) => {
    dispatch(fetchingShopStatusRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(
        baseServerURL + `/shopStatus/${data}`,
        // {
        //   headers: {
        //     authorization: data.jwt,
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //   },
        // },
      );
      await dispatch(fetchingShopStatusSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingShopStatusFailure(err));
    }
  };
};

export const timeToClearQueueChanged = (text) => {
  console.log('timeToClearQueueChanged', text);
  return {
    type: TIME_TO_CLEAR_QUEUE_CHANGED,
    payload: text,
  };
};

export const updateServerRequriedIO = (
  numberOfServerNeeded,
  extraNumberNeeded,
  isNewServerNeeded,
) => {
  return {
    type: UPDATE_SERVER_REQURIED_IO,
    payload: {
      numberOfServerNeeded: numberOfServerNeeded,
      extraNumberNeeded: extraNumberNeeded,
      isNewServerNeeded: isNewServerNeeded,
    },
  };
};

export const updatingClearQueueTimeRequest = () => {
  console.log('Dispatch updatingClearQueueTime request');
  return {
    type: UPDATE_CLEAR_QUEUE_TIME_REQUEST,
  };
};

export const updatingClearQueueTimeSuccess = (json) => {
  console.log('updatingClearQueueTime success');
  return {
    type: UPDATE_CLEAR_QUEUE_TIME_SUCCESS,
    payload: json.data,
  };
};

export const updatingClearQueueTimeFailure = (error) => {
  console.log('updatingClearQueueTime failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: UPDATE_CLEAR_QUEUE_TIME_FAILURE,
    payload: error.response.data.message,
  };
};

export const updateClearQueueTime = (data) => {
  console.log('updatingClearQueueTime queues');
  console.log('data.time', data.time);
  return async (dispatch) => {
    dispatch(updatingClearQueueTimeRequest());
    try {
      console.log('before endpoint');
      let response = await axios.post(
        baseServerURL +
          `/shopStatus/queueTime/${data.shopId}/?time=${data.time}`,
        {
          headers: {
            authorization: data.jwt,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      await dispatch(updatingClearQueueTimeSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(updatingClearQueueTimeFailure(err));
    }
  };
};
