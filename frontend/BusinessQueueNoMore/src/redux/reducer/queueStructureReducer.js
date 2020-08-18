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

const INITIAL_STATE = {
  isCreating: false,
  creatingQueuePlanError: '',
  queueDiscipline: '',
  timeLimit: '',
  maxLength: '',
  stageNumber: '',
  stageName: '',
  stageDescription: '',
  activityName: '',
  ActivityDescription: '',
  activityPriority: '',
  waitingTime: '',
  structures: [],
  stageActivities: [],
  shopActivities: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case QUEUE_DISCIPLINE_CHANGED:
      return {...state, queueDiscipline: action.payload};
    case TIME_LIMIT_CHANGED:
      return {...state, timeLimit: action.payload};
    case MAX_LENGTH_CHANGED:
      return {...state, maxLength: action.payload};
    case STAGE_NUMBER_CHANGED:
      return {...state, stageNumber: action.payload};
    case STAGE_NAME_CHANGED:
      return {...state, stageName: action.payload};
    case STAGE_DESCRIPTION_CHANGED:
      return {...state, stageDescription: action.payload};
    case ACTIVITY_NAME_CHANGED:
      return {...state, activityName: action.payload};
    case ACTIVITY_DESCRIPTION_CHANGED:
      return {...state, ActivityDescription: action.payload};
    case ACTIVITY_PRIORITY_CHANGED:
      return {...state, activityPriority: action.payload};
    case WAITING_TIME_CHANGED:
      return {...state, waitingTime: action.payload};
    case ADD_STAGE:
      return {...state, structures: action.payload};
    case ADD_ACTIVITY:
      return {
        ...state,
        stageActivities: action.payload,
        activityName: '',
        ActivityDescription: '',
        activityPriority: '',
        waitingTime: '',
      };
    case ADD_ANOTHER_STAGE:
      return {
        ...state,
        shopActivities: action.payload,
        stageActivities: [],
      };
    case REMOVE_LAST_STAGE:
      return {
        ...state,
        structures: action.payload.structuresArray,
        shopActivities: action.payload.shopActivities,
        stageNumber: '',
        stageName: '',
        stageDescription: '',
        activityName: '',
        ActivityDescription: '',
        activityPriority: '',
        waitingTime: '',
        stageActivities: [],
      };
    case CREATING_QUEUE_PLAN_REQUEST:
      return {...state, isCreating: true};
    case CREATING_QUEUE_PLAN_SUCCESS:
      return {
        ...state,
        isCreating: false,
        queueDiscipline: '',
        timeLimit: '',
        maxLength: '',
        stageNumber: '',
        stageName: '',
        stageDescription: '',
        activityName: '',
        ActivityDescription: '',
        activityPriority: '',
        waitingTime: '',
        structures: [],
        stageActivities: [],
        shopActivities: [],
        creatingQueuePlanError: '',
      };
    case CREATING_QUEUE_PLAN_FAILURE:
      return {
        ...state,
        isCreating: false,
        creatingQueuePlanError: action.payload,
      };
    default:
      return state;
  }
};
