import axios from 'axios';
import baseServerURL from '../../baseServerURL';

import {
  SELECT_ACTIVITY_CHANGED,
  QUEUE_DESCRIPTION_CHANGED,
  CREATING_QUEUE_REQUEST,
  CREATING_QUEUE_SUCCESS,
  CREATING_QUEUE_FAILURE,
  FETCHING_CUSTOMER_ACTIVE_QUEUE_REQUEST,
  FETCHING_CUSTOMER_ACTIVE_QUEUE_SUCCESS,
  FETCHING_CUSTOMER_QUEUE_ACTIVE_FAILURE,
  VIEW_QUEUE_CHANGED,
  FETCHING_CUSTOMER_COMPLETED_QUEUE_REQUEST,
  FETCHING_CUSTOMER_COMPLETED_QUEUE_SUCCESS,
  FETCHING_CUSTOMER_COMPLETED_QUEUE_FAILURE,
  IO_UPDATE_CUSTOMER_ACTIVE_QUEUE,
  IO_UPDATE_CUSTOMER_ACTIVE_QUEUE_TIME,
  UPDATE_QUEUE_REQUEST,
  UPDATE_QUEUE_SUCCESS,
  UPDATE_QUEUE_FAILURE,
} from '../types';

import * as RootNavigation from '../../RootNavigation';
import {retrieveJWT} from '../../asyncStorage';

export const selectActivityChanged = activity => {
  console.log(activity);
  return {
    type: SELECT_ACTIVITY_CHANGED,
    payload: activity,
  };
};

export const queueDescriptionChanged = text => {
  return {
    type: QUEUE_DESCRIPTION_CHANGED,
    payload: text,
  };
};

export const creatingQueueRequest = () => {
  console.log('Dispatch creating queue request');
  return {
    type: CREATING_QUEUE_REQUEST,
  };
};

export const creatingQueueSuccess = json => {
  console.log('Create queue success');
  console.log(json.data);
  return {
    type: CREATING_QUEUE_SUCCESS,
    payload: json.data,
  };
};

export const creatingQueueFailure = error => {
  console.log('Create queue failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: CREATING_QUEUE_FAILURE,
    payload: error.response.data.message,
  };
};

export const createQueue = data => {
  console.log('creating queue');
  return async dispatch => {
    dispatch(creatingQueueRequest());
    try {
      let response = await axios.post(
        baseServerURL + `/queue/customerQueue/${data.shopStatusId}`,
        {
          queueStage: data.queueStage,
          pax: 1,
          description: data.description,
          activity: data.activity,
          shopActivityId: data.activityId,
          priority: data.priority,
          queueDiscipline: data.queueDiscipline,
        },
        {
          headers: {
            authorization: data.jwt,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      dispatch(creatingQueueSuccess(response));
      RootNavigation.navigate('QueuedSuccessful', {
        queue: response.queue,
      });
    } catch (err) {
      dispatch(creatingQueueFailure(err));
    }
  };
};

export const fetchingCustomerActiveQueuesRequest = () => {
  console.log('Dispatch fetching customer queues request');
  return {
    type: FETCHING_CUSTOMER_ACTIVE_QUEUE_REQUEST,
  };
};

export const fetchingCustomerActiveQueuesSuccess = json => {
  console.log('Fetch customer queues success');
  return {
    type: FETCHING_CUSTOMER_ACTIVE_QUEUE_SUCCESS,
    payload: json.data,
  };
};

export const fetchingCustomerActiveQeuesFailure = error => {
  console.log('Fetch customer queues failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_CUSTOMER_QUEUE_ACTIVE_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchCustomerActiveQueues = data => {
  console.log('fetching customer queues');
  return async dispatch => {
    dispatch(fetchingCustomerActiveQueuesRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(
        baseServerURL + `/queue/customerQueue/?condition=active`,
        {
          headers: {
            authorization: data,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      await dispatch(fetchingCustomerActiveQueuesSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingCustomerActiveQeuesFailure(err));
    }
  };
};

export const viewQueueChanged = queue => {
  console.log('view queue changed', queue);
  return {
    type: VIEW_QUEUE_CHANGED,
    payload: queue,
  };
};

export const fetchingCustomerCompletedQueuesRequest = () => {
  console.log('Dispatch fetching customer completed queues request');
  return {
    type: FETCHING_CUSTOMER_COMPLETED_QUEUE_REQUEST,
  };
};

export const fetchingCustomerCompltedQueuesSuccess = json => {
  console.log('Fetch customer completed queues success');
  return {
    type: FETCHING_CUSTOMER_COMPLETED_QUEUE_SUCCESS,
    payload: json.data,
  };
};

export const fetchingCustomerCompeltedQeuesFailure = error => {
  console.log('Fetch customer completed queues failure');
  // console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_CUSTOMER_COMPLETED_QUEUE_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchCustomerCompletedQueues = data => {
  console.log('fetching customer completed queues');
  return async dispatch => {
    dispatch(fetchingCustomerCompletedQueuesRequest());
    try {
      // console.log('before endpoint');
      let response = await axios.get(
        baseServerURL + `/queue/customerQueue/?condition=completed`,
        {
          headers: {
            authorization: data,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      await dispatch(fetchingCustomerCompltedQueuesSuccess(response));
      // console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingCustomerCompeltedQeuesFailure(err));
    }
  };
};

export const ioUpdateCusomterActiveQueue = (customerActiveQueues, queue) => {
  console.log('io update customer active queue');
  let _id = '_id';
  let queueId = queue._id;
  let arrayIndex = customerActiveQueues.findIndex(obj => obj[_id] == queueId);
  if (arrayIndex != -1) {
    customerActiveQueues[arrayIndex] = queue;
  }
  return {
    type: IO_UPDATE_CUSTOMER_ACTIVE_QUEUE,
    payload: customerActiveQueues,
  };
};

// export const ioUpdateCustomerActiveQueueTime = () =>{
//   return{
//     type: IO_UPDATE_CUSTOMER_ACTIVE_QUEUE_TIME,
//     payload:
//   }}

export const updateQueueRequest = () => {
  console.log('Dispatch updateQueue request');
  return {
    type: UPDATE_QUEUE_REQUEST,
  };
};

export const updatingQueueSuccess = json => {
  console.log('updatingQueue success');
  return {
    type: UPDATE_QUEUE_SUCCESS,
    payload: json.data,
  };
};

export const updatingQueueFailure = error => {
  console.log('updatingQueue failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: UPDATE_QUEUE_FAILURE,
    payload: error.response.data.message,
  };
};

export const updateQueue = data => {
  console.log('updating Queue');
  return async dispatch => {
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
      RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(updatingQueueFailure(err));
    }
  };
};
