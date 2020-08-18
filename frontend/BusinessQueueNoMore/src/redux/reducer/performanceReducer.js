import {
  DATE_ANALYSIS_CHANGED,
  FETCH_SHOP_ANALYSIS_REQUEST,
  FETCH_SHOP_ANALYSIS_SUCCESS,
  FETCH_SHOP_ANALYSIS_FAILURE,
} from '../types';

const INITIAL_STATE = {
  dateAnalysis: '2020-08-04',
  isFetchingShopAnalysis: false,
  shopPerformanceAnalyses: [],
  fetchingShopAnalysisError: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DATE_ANALYSIS_CHANGED:
      return {...state, dateAnalysis: action.payload};
    case FETCH_SHOP_ANALYSIS_REQUEST:
      return {...state, isFetchingShopAnalysis: true};
    case FETCH_SHOP_ANALYSIS_SUCCESS:
      return {
        ...state,
        isFetchingShopAnalysis: false,
        fetchingShopAnalysisError: '',
        shopPerformanceAnalyses: action.payload.shopPerformanceAnalysis,
      };
    case FETCH_SHOP_ANALYSIS_FAILURE:
      return {
        ...state,
        isFetchingShopAnalysis: false,
        fetchingShopAnalysisError: action.payload,
      };
    default:
      return state;
  }
};
