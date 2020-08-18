import axios from 'axios';
import baseServerURL from '../../baseServerURL';

import {
  FETCHING_CURRENTLY_SERVING_QUEUE_REQUEST,
  FETCHING_CURRENTLY_SERVING_QUEUE_SUCCESS,
  FETCHING_CURRENTLY_SERVING_QUEUE_FAILURE,
  FETCHING_QUEUING_QUEUE_REQUEST,
  FETCHING_QUEUING_QUEUE_SUCCESS,
  FETCHING_QUEUING_QUEUE_FAILURE,
  FETCHING_STAGE_ONE_QUEUE_REQUEST,
  FETCHING_STAGE_ONE_QUEUE_SUCCESS,
  FETCHING_STAGE_ONE_QUEUE_FAILURE,
  FETCHING_SPECIFIC_QUEUE_REQUEST,
  FETCHING_SPECIFIC_QUEUE_SUCCESS,
  FETCHING_SPECIFIC_QUEUE_FAILURE,
  FETCHING_SHOP_ACTIVITY_REQUEST,
  FETCHING_SHOP_ACTIVITY_SUCCESS,
  FETCHING_SHOP_ACTIVITY_FAILURE,
  SELECTED_ACTIVITY_CHANGED,
  UPDATE_QUEUE_REQUEST,
  UPDATE_QUEUE_SUCCESS,
  UPDATE_QUEUE_FAILURE,
  UPDATE_IS_ABLE_TO_SERVE_ACTIVITY,
} from '../types';

import * as RootNavigation from '../../RootNavigation';

export const fetchingCurrentlyServingQueuesRequest = () => {
  console.log('Dispatch currently serving queues request');
  return {
    type: FETCHING_CURRENTLY_SERVING_QUEUE_REQUEST,
  };
};

export const fetchingCurrentlyServingQueuesSuccess = (json) => {
  console.log('Fetch currently serving success');
  return {
    type: FETCHING_CURRENTLY_SERVING_QUEUE_SUCCESS,
    payload: json.data,
  };
};

export const fetchingCurrentlyServingQeuesFailure = (error) => {
  console.log('Fetch currently serving failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_CURRENTLY_SERVING_QUEUE_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchCurrentlyServingQueues = (data) => {
  console.log('fetching currently serving queues');
  return async (dispatch) => {
    dispatch(fetchingCurrentlyServingQueuesRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(
        baseServerURL + `/queue/shopQueues/${data.shopId}/?condition=called`,
        {
          headers: {
            authorization: data.jwt,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      await dispatch(fetchingCurrentlyServingQueuesSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingCurrentlyServingQeuesFailure(err));
    }
  };
};

export const fetchingQueuingQueuesRequest = () => {
  console.log('Dispatch Queuing queues request');
  return {
    type: FETCHING_QUEUING_QUEUE_REQUEST,
  };
};

export const fetchingQueuingQueuesSuccess = (json) => {
  console.log('Fetch Queuing queues success');
  return {
    type: FETCHING_QUEUING_QUEUE_SUCCESS,
    payload: json.data,
  };
};

export const fetchingQueuinggQeuesFailure = (error) => {
  console.log('Fetch Queuing queue failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_QUEUING_QUEUE_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchQueuingQueues = (data) => {
  console.log('fetching Queuing queues');
  return async (dispatch) => {
    dispatch(fetchingQueuingQueuesRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(
        baseServerURL + `/queue/shopQueues/${data.shopId}/?condition=queuing`,
        {
          headers: {
            authorization: data.jwt,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      await dispatch(fetchingQueuingQueuesSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingQueuinggQeuesFailure(err));
    }
  };
};

export const fetchingStageOneQueuesRequest = () => {
  console.log('Dispatch StageOne queues request');
  return {
    type: FETCHING_STAGE_ONE_QUEUE_REQUEST,
  };
};

export const fetchingStageOneQueuesSuccess = (json) => {
  console.log('Fetch StageOne queues success');
  return {
    type: FETCHING_STAGE_ONE_QUEUE_SUCCESS,
    payload: json.data,
  };
};

export const fetchingStageOneQeuesFailure = (error) => {
  console.log('Fetch StageOne queue failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_STAGE_ONE_QUEUE_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchStageOneQueues = (data) => {
  console.log('fetching StageOne queues');
  return async (dispatch) => {
    dispatch(fetchingStageOneQueuesRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(
        baseServerURL +
          `/queue/shopQueues/${data.shopId}/?condition=queuing&&stage=1`,
        {
          headers: {
            authorization: data.jwt,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      await dispatch(fetchingStageOneQueuesSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingStageOneQeuesFailure(err));
    }
  };
};

export const fetchingSpecificQueuesRequest = () => {
  console.log('Dispatch Specific queues request');
  return {
    type: FETCHING_SPECIFIC_QUEUE_REQUEST,
  };
};

export const fetchingSpecificQueuesSuccess = (json) => {
  console.log('Fetch Specific queues success');
  return {
    type: FETCHING_SPECIFIC_QUEUE_SUCCESS,
    payload: json.data,
  };
};

export const fetchingSpecificQeuesFailure = (error) => {
  console.log('Fetch Specific queue failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_SPECIFIC_QUEUE_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchSpecificQueues = (data) => {
  console.log('fetching Specific queues');
  return async (dispatch) => {
    dispatch(fetchingSpecificQueuesRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(
        baseServerURL + `/queue/customerQueue/${data}`,
        {
          // headers: {
          //   authorization: data.jwt,
          //   Accept: 'application/json',
          //   'Content-Type': 'application/json',
          // },
        },
      );
      await dispatch(fetchingSpecificQueuesSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingSpecificQeuesFailure(err));
    }
  };
};

export const fetchingShopActivitiesRequest = () => {
  console.log('Dispatch ShopActivities request');
  return {
    type: FETCHING_SHOP_ACTIVITY_REQUEST,
  };
};

export const fetchingShopActivitiesSuccess = (json) => {
  console.log('Fetch ShopActivities success');
  return {
    type: FETCHING_SHOP_ACTIVITY_SUCCESS,
    payload: json.data,
  };
};

export const fetchingShopActivitiesFailure = (error) => {
  console.log('Fetch ShopActivities failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_SHOP_ACTIVITY_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchShopActivities = (data) => {
  console.log('fetching ShopActivities');
  return async (dispatch) => {
    dispatch(fetchingShopActivitiesRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(
        baseServerURL +
          `/shopActivity/allActivities/${data.shopId}/?stage=${data.stage}`,
        {
          // headers: {
          //   authorization: data.jwt,
          //   Accept: 'application/json',
          //   'Content-Type': 'application/json',
          // },
        },
      );
      await dispatch(fetchingShopActivitiesSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingShopActivitiesFailure(err));
    }
  };
};

export const selectActivityChanged = (activity) => {
  console.log(activity);
  return {
    type: SELECTED_ACTIVITY_CHANGED,
    payload: activity,
  };
};

export const updateQueueRequest = () => {
  console.log('Dispatch updateQueue request');
  return {
    type: UPDATE_QUEUE_REQUEST,
  };
};

export const updatingQueueSuccess = (json) => {
  console.log('updatingQueue success');
  return {
    type: UPDATE_QUEUE_SUCCESS,
    payload: json.data,
  };
};

export const updatingQueueFailure = (error) => {
  console.log('updatingQueue failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: UPDATE_QUEUE_FAILURE,
    payload: error.response.data.message,
  };
};

export const updateQueue = (data) => {
  console.log('updating Queue');
  return async (dispatch) => {
    dispatch(updateQueueRequest());
    try {
      console.log('before endpoint');
      let response = await axios.put(
        baseServerURL +
          `/queue/customerQueues/${data.queueId}/?action=${data.action}`,
        {
          currentShopActivityId: data.currentShopActivityId,
          nextShopActivityId: data.nextShopActivityId,
          stage: data.stage,
        },
        {
          headers: {
            authorization: data.jwt,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      await dispatch(updatingQueueSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(updatingQueueFailure(err));
    }
  };
};

export const isAbleToServeAvtivityChanged = (data) => {
  return {
    type: UPDATE_IS_ABLE_TO_SERVE_ACTIVITY,
    payload: data,
  };
};
