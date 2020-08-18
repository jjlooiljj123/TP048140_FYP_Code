import axios from 'axios';
import baseServerURL from '../../baseServerURL';

import {
  FETCHING_ALL_SHOPS_REQUEST,
  FETCHING_ALL_SHOPS_SUCCESS,
  FETCHING_ALL_SHOPS_FAILURE,
  FETCHING_SHOP_REQUEST,
  FETCHING_SHOP_SUCCESS,
  FETCHING_SHOP_FAILURE,
  SSEARCH_SHOP_CHANGED,
  FETCHING_SHOP_INFO_REQUEST,
  FETCHING_SHOP_INFO_SUCCESS,
  FETCHING_SHOP_INFO_FAILURE,
  IO_UPDATE_SPECIFIC_SHOP_INFO,
  IO_UPDATE_VIEWING_SHOP_INFO,
  SELECT_QUEUE_LENGTH_CHANGED,
  BEAUTY_SALON_CHECKED,
  FOOD_CHECKED,
  HAIR_SALON_CHECKED,
  MEDICAL_CHECKED,
  TELEMCOMMUNICATION_CHECKED,
  CLEAR_CHECKED,
  FILTER_SHOP_REQUEST,
  FILTER_SHOP_SUCCESS,
  FILTER_SHOP_FAILURE,
} from '../types';

import * as RootNavigation from '../../RootNavigation';

export const selectQueueLengthChanged = text => {
  return {
    type: SELECT_QUEUE_LENGTH_CHANGED,
    payload: text,
  };
};

export const beatySalonChecked = text => {
  return {
    type: BEAUTY_SALON_CHECKED,
    payload: text,
  };
};
export const foodChecked = text => {
  return {
    type: FOOD_CHECKED,
    payload: text,
  };
};
export const hairSalonChecked = text => {
  return {
    type: HAIR_SALON_CHECKED,
    payload: text,
  };
};
export const medicalChecked = text => {
  return {
    type: MEDICAL_CHECKED,
    payload: text,
  };
};
export const telecommunicationChecked = text => {
  return {
    type: TELEMCOMMUNICATION_CHECKED,
    payload: text,
  };
};
export const clearChecked = () => {
  return {
    type: CLEAR_CHECKED,
  };
};

export const filterShopsRequest = () => {
  console.log('Dispatch filter shops request');
  return {
    type: FILTER_SHOP_REQUEST,
  };
};

export const filterShopsSuccess = json => {
  console.log('Filter shops success');
  // console.log(json.data.shopStatus);
  return {
    type: FILTER_SHOP_SUCCESS,
    payload: json.data,
  };
};

export const filterShopsFailure = error => {
  console.log('Filter shops failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FILTER_SHOP_FAILURE,
    payload: error.response.data.message,
  };
};

export const filterShops = data => {
  console.log('Fitlering shops');
  return async dispatch => {
    dispatch(filterShopsRequest());
    try {
      console.log('before endpoint');
      let response;
      if (data.directory == null) {
        response = await axios.get(
          baseServerURL + `/shopStatus/?queueLentgth=${data.queueLength}`,
        );
      } else {
        response = await axios.get(
          baseServerURL +
            `/shopStatus/?directory=${data.directory}&queueLentgth=${
              data.queueLength
            }`,
        );
      }
      dispatch(filterShopsSuccess(response));
      RootNavigation.navigate('SearchShop');
    } catch (err) {
      dispatch(filterShopsFailure(err));
    }
  };
};

export const searchShopChanged = (text, shopArray) => {
  const newArray = shopArray.filter(item => {
    const arrayData = item.shopStatus_shopName.toUpperCase();
    const textData = text.toUpperCase();
    return arrayData.indexOf(textData) > -1;
  });
  return {
    type: SSEARCH_SHOP_CHANGED,
    payload: {text: text, newArray: newArray},
  };
};

export const fetchingAllShopsRequest = () => {
  console.log('Dispatch fetching all shops request');
  return {
    type: FETCHING_ALL_SHOPS_REQUEST,
  };
};

export const fetchingAllShopsSuccess = json => {
  console.log('Fetch all shops success');
  // console.log(json.data.shopStatus);
  return {
    type: FETCHING_ALL_SHOPS_SUCCESS,
    payload: json.data,
  };
};

export const fetchingAllShopsFailure = error => {
  console.log('Fetch all shops failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_ALL_SHOPS_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchAllShops = data => {
  console.log('fetching all shops');
  return async dispatch => {
    dispatch(fetchingAllShopsRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(baseServerURL + '/shopStatus');
      dispatch(fetchingAllShopsSuccess(response));
    } catch (err) {
      dispatch(fetchingAllShopsFailure(err));
    }
  };
};

export const fetchingShopRequest = () => {
  console.log('Dispatch fetching shop request');
  return {
    type: FETCHING_SHOP_REQUEST,
  };
};

export const fetchingShopSuccess = json => {
  console.log('Fetch shop success');
  // console.log(json.data.shopStatus);
  return {
    type: FETCHING_SHOP_SUCCESS,
    payload: json.data,
  };
};

export const fetchingShopFailure = error => {
  console.log('Fetch shop failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_SHOP_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchShop = data => {
  console.log('fetching a shop');
  console.log('shopid', data);
  return async dispatch => {
    dispatch(fetchingShopRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(baseServerURL + `/shopStatus/${data}`);
      dispatch(fetchingShopSuccess(response));
    } catch (err) {
      dispatch(fetchingShopFailure(err));
    }
  };
};

export const fetchingShopInfoRequest = () => {
  console.log('Dispatch fetching shopInfo request');
  return {
    type: FETCHING_SHOP_INFO_REQUEST,
  };
};

export const fetchingShopInfoSuccess = json => {
  console.log('Fetch shop info success');
  // console.log(json.data.shopStatus);
  return {
    type: FETCHING_SHOP_INFO_SUCCESS,
    payload: json.data,
  };
};

export const fetchingShopInfoFailure = error => {
  console.log('Fetch shop info failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: FETCHING_SHOP_INFO_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchShopInfo = data => {
  console.log('fetching a shop info');
  console.log('shopid', data);
  return async dispatch => {
    dispatch(fetchingShopInfoRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(baseServerURL + `/shop/${data}`);
      dispatch(fetchingShopInfoSuccess(response));
    } catch (err) {
      dispatch(fetchingShopInfoFailure(err));
    }
  };
};

export const ioUpdateSpecificShopInfo = (shops, shopStatus) => {
  console.log('io update specific shop info');
  let _id = '_id';
  let shopId = shopStatus._id;
  let arrayIndex = shops.findIndex(obj => obj[_id] == shopId);
  if (arrayIndex != -1) {
    shops[arrayIndex] = shopStatus;
  }
  return {
    type: IO_UPDATE_SPECIFIC_SHOP_INFO,
    payload: shops,
  };
};

export const ioUpdatViewingShopInfo = shopStatus => {
  console.log('io update viewing shop info');
  return {
    type: IO_UPDATE_VIEWING_SHOP_INFO,
    payload: shopStatus,
  };
};
