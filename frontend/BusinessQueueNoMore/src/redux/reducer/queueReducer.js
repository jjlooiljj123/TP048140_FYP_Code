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

const INITIAL_STATE = {
  isFetchingCurrentlyServing: false,
  currentlyServingQueues: [],
  numberOfCurrentlyServingQueues: 0,
  fetchingCurrentlyServingQueuesError: '',
  isFetchingQueuing: false,
  queuingQueues: [],
  numberOfQueuingQueues: 0,
  fetchingQueuingQueuesError: '',
  isFetchingStageOne: false,
  stageOneQueues: [],
  numberOfStageOneQueues: 0,
  fetchingStageOneQueuesError: '',
  specificQueue: {},
  isFetchingSpecific: false,
  fetchingSpecificQueueError: '',
  isFetchingShopActivities: false,
  fetchingShopActivitiesError: '',
  shopActivities: [],
  totalStage: 0,
  selectedActivity: '',
  isUpdatingQueue: false,
  updatingQueueError: '',
  updatedQueue: {},
  isAbleToServeActivity: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_CURRENTLY_SERVING_QUEUE_REQUEST:
      return {
        ...state,
        isFetchingCurrentlyServing: true,
      };
    case FETCHING_CURRENTLY_SERVING_QUEUE_SUCCESS:
      return {
        ...state,
        isFetchingCurrentlyServing: false,
        currentlyServingQueues: action.payload.shopQueues,
        numberOfCurrentlyServingQueues: action.payload.numberOfShopQueues,
        fetchingCurrentlyServingQueuesError: '',
      };
    case FETCHING_CURRENTLY_SERVING_QUEUE_FAILURE:
      return {
        ...state,
        isFetchingCurrentlyServing: false,
        fetchingCurrentlyServingQueuesError: action.payload,
      };
    case FETCHING_QUEUING_QUEUE_REQUEST:
      return {
        ...state,
        isFetchingQueuing: true,
      };
    case FETCHING_QUEUING_QUEUE_SUCCESS:
      return {
        ...state,
        isFetchingQueuing: false,
        queuingQueues: action.payload.shopQueues,
        numberOfQueuingQueues: action.payload.numberOfShopQueues,
        fetchingQueuingQueuesError: '',
      };
    case FETCHING_QUEUING_QUEUE_FAILURE:
      return {
        ...state,
        isFetchingQueuing: false,
        fetchingQueuingQueuesError: action.payload,
      };
    case FETCHING_STAGE_ONE_QUEUE_REQUEST:
      return {
        ...state,
        isFetchingStageOne: true,
      };
    case FETCHING_STAGE_ONE_QUEUE_SUCCESS:
      return {
        ...state,
        isFetchingStageOne: false,
        stageOneQueues: action.payload.shopQueues,
        numberOfStageOneQueues: action.payload.numberOfShopQueues,
        fetchingStageOneQueuesError: '',
      };
    case FETCHING_STAGE_ONE_QUEUE_FAILURE:
      return {
        ...state,
        isFetchingStageOne: false,
        fetchingStageOneQueuesError: action.payload,
      };
    case FETCHING_SPECIFIC_QUEUE_REQUEST:
      return {
        ...state,
        isFetchingSpecific: true,
      };
    case FETCHING_SPECIFIC_QUEUE_SUCCESS:
      return {
        ...state,
        isFetchingSpecific: false,
        specificQueue: action.payload.queue,
        fetchingSpecificQueueError: '',
      };
    case FETCHING_SPECIFIC_QUEUE_FAILURE:
      return {
        ...state,
        isFetchingSpecific: false,
        fetchingSpecificQueueError: action.payload,
      };
    case FETCHING_SHOP_ACTIVITY_REQUEST:
      return {
        ...state,
        isFetchingShopActivities: true,
      };
    case FETCHING_SHOP_ACTIVITY_SUCCESS:
      return {
        ...state,
        isFetchingSpecific: false,
        shopActivities: action.payload.shopActivities,
        totalStage: action.payload.totalStages,
        fetchingShopActivitiesError: '',
      };
    case FETCHING_SHOP_ACTIVITY_FAILURE:
      return {
        ...state,
        isFetchingSpecific: false,
        fetchingShopActivitiesError: action.payload,
      };
    case SELECTED_ACTIVITY_CHANGED:
      return {...state, selectedActivity: action.payload};
    case UPDATE_QUEUE_REQUEST:
      return {...state, isUpdatingQueue: true};
    case UPDATE_QUEUE_SUCCESS:
      return {
        ...state,
        isUpdatingQueue: false,
        updatingQueueError: '',
        updatedQueue: action.payload.queueResult,
      };
    case UPDATE_QUEUE_FAILURE:
      return {...state, updatingQueueError: action.payload};
    case UPDATE_IS_ABLE_TO_SERVE_ACTIVITY:
      return {...state, isAbleToServeActivity: action.payload};
    default:
      return state;
  }
};
