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
  UPDATE_QUEUE_REQUEST,
  UPDATE_QUEUE_SUCCESS,
  UPDATE_QUEUE_FAILURE,
} from '../types';

const INITIAL_STATE = {
  isFetching: false,
  selectedActivity: '',
  queueDescription: '',
  queue: {},
  createQueueError: '',
  shopStatus: {},
  customerActiveQueues: [],
  fetchingActiveQueuesError: '',
  activeQueueIsFecthing: false,
  customerCompletedQueues: [],
  fetchingCompletedQueuesError: '',
  completedQueueIsFecthing: false,
  isUpdatingQueue: false,
  updatingQueueError: '',
  updatedQueue: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_ACTIVITY_CHANGED:
      return {...state, selectedActivity: action.payload};
    case QUEUE_DESCRIPTION_CHANGED:
      return {...state, queueDescription: action.payload};
    case CREATING_QUEUE_REQUEST:
      return {...state, isFetching: true};
    case CREATING_QUEUE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        queue: action.payload.queue,
        selectedActivity: '',
        queueDescription: '',
        shopStatus: action.payload.shopStatus,
      };
    case CREATING_QUEUE_FAILURE:
      return {...state, isFetching: false, createQueueError: action.payload};
    case FETCHING_CUSTOMER_ACTIVE_QUEUE_REQUEST:
      return {...state, activeQueueIsFecthing: true};
    case FETCHING_CUSTOMER_ACTIVE_QUEUE_SUCCESS:
      return {
        ...state,
        activeQueueIsFecthing: false,
        customerActiveQueues: action.payload.queues,
        fetchingActiveQueuesError: '',
      };
    case FETCHING_CUSTOMER_QUEUE_ACTIVE_FAILURE:
      return {
        ...state,
        activeQueueIsFecthing: false,
        fetchingActiveQueuesError: action.payload,
      };
    case VIEW_QUEUE_CHANGED:
      return {
        ...state,
        queue: action.payload,
      };
    case FETCHING_CUSTOMER_COMPLETED_QUEUE_REQUEST:
      return {...state, completedQueueIsFecthing: true};
    case FETCHING_CUSTOMER_COMPLETED_QUEUE_SUCCESS:
      return {
        ...state,
        completedQueueIsFecthing: false,
        customerCompletedQueues: action.payload.queues,
        fetchingCompletedQueuesError: '',
      };
    case FETCHING_CUSTOMER_COMPLETED_QUEUE_FAILURE:
      return {
        ...state,
        completedQueueIsFecthing: false,
        fetchingCompletedQueuesError: action.payload,
      };
    case IO_UPDATE_CUSTOMER_ACTIVE_QUEUE:
      return {
        ...state,
        customerActiveQueues: action.payload,
      };
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
    default:
      return state;
  }
};
