import Toast from 'react-native-simple-toast';

import axios from 'axios';
import baseServerURL from '../../baseServerURL';
import * as RootNavigation from '../../RootNavigation';

import {
  DATE_ANALYSIS_CHANGED,
  FETCH_SHOP_ANALYSIS_REQUEST,
  FETCH_SHOP_ANALYSIS_SUCCESS,
  FETCH_SHOP_ANALYSIS_FAILURE,
} from '../types';

export const dateAnalysisChanged = (date) => {
  return {
    type: DATE_ANALYSIS_CHANGED,
    payload: date,
  };
};

export const fetchingShopAnalysisRequest = () => {
  console.log('Dispatch fetching ShopAnalysis request');
  return {
    type: FETCH_SHOP_ANALYSIS_REQUEST,
  };
};

export const fetchingShopAnalysisSuccess = (json) => {
  console.log('Fetch ShopAnalysis success');
  return {
    type: FETCH_SHOP_ANALYSIS_SUCCESS,
    payload: json.data,
  };
};

export const fetchingShopAnalysisFailure = (error) => {
  console.log('Fetch ShopAnalysis failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCH_SHOP_ANALYSIS_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchShopAnalysis = (data) => {
  console.log('fetching ShopAnalysis');
  return async (dispatch) => {
    dispatch(fetchingShopAnalysisRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(
        baseServerURL +
          `/performance/shopPerformanceAnalysis/${data.shopId}/?startTime=${data.startTime}&endTime=${data.endtime}`,
      );
      await dispatch(fetchingShopAnalysisSuccess(response));
      console.log('response', response.data);

      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingShopAnalysisFailure(err));
    }
  };
};
