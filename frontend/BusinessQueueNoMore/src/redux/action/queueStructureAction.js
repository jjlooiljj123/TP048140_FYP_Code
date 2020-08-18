import axios from 'axios';
import baseServerURL from '../../baseServerURL';

import {
  QUEUE_DISCIPLINE_CHANGED,
  TIME_LIMIT_CHANGED,
  MAX_LENGTH_CHANGED,
  STAGE_NUMBER_CHANGED,
  STAGE_NAME_CHANGED,
  STAGE_DESCRIPTION_CHANGED,
  ACTIVITY_NAME_CHANGED,
  ACTIVITY_DESCRIPTION_CHANGED,
  ACTIVITY_PRIORITY_CHANGED,
  WAITING_TIME_CHANGED,
  ADD_STAGE,
  ADD_ACTIVITY,
  ADD_ANOTHER_STAGE,
  REMOVE_LAST_STAGE,
  CREATING_QUEUE_PLAN_REQUEST,
  CREATING_QUEUE_PLAN_SUCCESS,
  CREATING_QUEUE_PLAN_FAILURE,
} from '../types';

import * as RootNavigation from '../../RootNavigation';

export const queueDisciplineChanged = (text) => {
  return {
    type: QUEUE_DISCIPLINE_CHANGED,
    payload: text,
  };
};

export const timeLimitChanged = (text) => {
  return {
    type: TIME_LIMIT_CHANGED,
    payload: text,
  };
};

export const maxLengthChanged = (text) => {
  return {
    type: MAX_LENGTH_CHANGED,
    payload: text,
  };
};

export const stageNumberChanged = (text) => {
  return {
    type: STAGE_NUMBER_CHANGED,
    payload: text,
  };
};

export const stageNameChanged = (text) => {
  return {
    type: STAGE_NAME_CHANGED,
    payload: text,
  };
};

export const stageDescriptionChanged = (text) => {
  return {
    type: STAGE_DESCRIPTION_CHANGED,
    payload: text,
  };
};

export const activityNameChanged = (text) => {
  return {
    type: ACTIVITY_NAME_CHANGED,
    payload: text,
  };
};

export const activityDescriptionChanged = (text) => {
  return {
    type: ACTIVITY_DESCRIPTION_CHANGED,
    payload: text,
  };
};

export const activityPriorityChanged = (text) => {
  return {
    type: ACTIVITY_PRIORITY_CHANGED,
    payload: text,
  };
};

export const waitingTimeChanged = (text) => {
  return {
    type: WAITING_TIME_CHANGED,
    payload: text,
  };
};

export const addStage = (data) => {
  console.log('add stage');
  let structuresArray = data.structuresArray;
  // console.log('structuresArray inside', structuresArray);
  const stageObject = {
    stageNumber: data.stageNumber,
    nameOfStage: data.nameOfStage,
    description: data.description,
  };
  // console.log('structuresArray inside object', stageObject);
  structuresArray.push(stageObject);
  console.log('structuresArray', structuresArray);
  return {
    type: ADD_STAGE,
    payload: structuresArray,
  };
};

export const addActivity = (data) => {
  console.log('add activity');
  let stageActivities = data.stageActivities;
  const stageArray = [
    data.activityName,
    data.ActivityDescription,
    data.activityPriority,
    data.waitingTime,
  ];

  stageActivities.push(stageArray);
  console.log('stageActivities', stageActivities);
  return {
    type: ADD_ACTIVITY,
    payload: stageActivities,
  };
};

export const addAnotherStage = (data) => {
  let shopActivities = data.shopActivities;

  shopActivities.push(data.stageActivities);
  return {
    type: ADD_ANOTHER_STAGE,
    payload: shopActivities,
  };
};

export const removeLastStage = (data) => {
  let structuresArray = data.structuresArray;
  let shopActivities = data.shopActivities;

  structuresArray.pop();
  shopActivities.pop();
  return {
    type: REMOVE_LAST_STAGE,
    payload: {
      structuresArray: structuresArray,
      shopActivities: shopActivities,
    },
  };
};

export const creatingQueuePlanRequest = () => {
  console.log('Dispatch creating QueuePlan request');
  return {
    type: CREATING_QUEUE_PLAN_REQUEST,
  };
};

export const creatingQueuePlanSuccess = (json) => {
  console.log('Create QueuePlan success');
  // console.log('QueuePlan', json.data);
  RootNavigation.navigate('Login');
  return {
    type: CREATING_QUEUE_PLAN_SUCCESS,
    // payload: json.data,
  };
};

export const creatingQueuePlanFailure = (error) => {
  console.log('Create QueuePlan failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: CREATING_QUEUE_PLAN_FAILURE,
    payload: error.response.data.message,
  };
};

export const createQueuePlan = (data) => {
  let shopActivities = data.shopActivities;
  // console.log('shopActivities', data.shopActivities);
  // console.log('stageActivities', data.stageActivities);
  shopActivities.push(data.stageActivities);
  // console.log('shopActivities2', data.shopActivities);
  // console.log('shopActivities2.1', shopActivities);
  // console.log('stageActivities2', data.stageActivities);
  console.log('creating QueuePlan');
  const objet = {
    queueDiscipline: data.queueDiscipline,
    structures: data.structures,
    shopActivities: shopActivities,
    maxQueueLength: data.maxQueueLength,
    timeLimitForCustomer: data.timeLimitForCustomer,
  };
  console.log('see', objet);
  console.log('see shopActivities', objet.shopActivities);
  console.log('data.shopId', data.shopId);
  return async (dispatch) => {
    dispatch(creatingQueuePlanRequest());
    try {
      let response = await axios.post(
        baseServerURL + `/queue/queuePlan/${data.shopId}`,
        {
          queueDiscipline: data.queueDiscipline,
          structures: data.structures,
          shopActivities: data.shopActivities,
          maxQueueLength: data.maxQueueLength,
          timeLimitForCustomer: data.timeLimitForCustomer,
        },
      );
      dispatch(creatingQueuePlanSuccess(response));
      RootNavigation.navigate('Login');
    } catch (err) {
      dispatch(creatingQueuePlanFailure(err));
    }
  };
};
