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

const INITIAL_STATE = {
  isFetchingShopStatus: false,
  shopStatus: {},
  fetchingShopStatusError: '',
  timeToClearQueueTextInput: 998,
  isNewServerNeeded: false,
  numberOfServerNeeded: 0,
  extraNumberNeeded: 0,
  isUpdatingClearQueueTime: false,
  updatingClearQueueTimeError: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_SHOP_STATUS_REQUEST:
      return {...state, isFetchingShopStatus: true};
    case FETCHING_SHOP_STATUS_SUCCESS:
      return {
        ...state,
        shopStatus: action.payload.shopStatus,
        fetchingShopStatusError: '',
        timeToClearQueueTextInput:
          action.payload.shopStatus.shopStatus_timeToClearQueue,
      };
    case FETCHING_SHOP_STATUS_FAILURE:
      return {...state, fetchingShopStatusError: action.payload};
    case TIME_TO_CLEAR_QUEUE_CHANGED:
      return {...state, timeToClearQueueTextInput: action.payload};
    case UPDATE_SERVER_REQURIED_IO:
      return {
        ...state,
        isNewServerNeeded: action.payload.isNewServerNeeded,
        numberOfServerNeeded: action.payload.numberOfServerNeeded,
        extraNumberNeeded: action.payload.extraNumberNeeded,
      };
    case UPDATE_CLEAR_QUEUE_TIME_REQUEST:
      return {...state, isUpdatingClearQueueTime: true};
    case UPDATE_CLEAR_QUEUE_TIME_SUCCESS:
      return {
        ...state,
        isUpdatingClearQueueTime: false,
        updatingClearQueueTimeError: '',
      };
    case UPDATE_CLEAR_QUEUE_TIME_FAILURE:
      return {
        ...state,
        isUpdatingClearQueueTime: false,
        updatingClearQueueTimeError: action.payload,
      };
    default:
      return state;
  }
};
