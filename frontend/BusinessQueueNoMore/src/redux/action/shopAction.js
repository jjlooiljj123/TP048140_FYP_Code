import axios from 'axios';
import baseServerURL from '../../baseServerURL';
import FormData from 'form-data';

import {
  SHOP_SHOP_NAME_CHANGED,
  SHOP_SHOP_BRANCH_CHANGED,
  SHOP_SHOP_ADDRESS1_CHANGED,
  SHOP_SHOP_ADDRESS2_CHANGED,
  SHOP_SHOP_ADDRESS3_CHANGED,
  SHOP_SHOP_CITY_CHANGED,
  SHOP_SHOP_POSTAL_CODE_CHANGED,
  SHOP_SHOP_STATE_CHANGED,
  SHOP_SHOP_COUNTRY_CHANGED,
  SHOP_SHOP_DIRECTORY_CHANGED,
  SHOP_SHOP_OPENING_HOUR_CHANGED,
  SHOP_SHOP_CLOSING_HOUR_CHANGED,
  CREATING_SHOP_REQUEST,
  CREATING_SHOP_SUCCESS,
  CREATING_SHOP_FAILURE,
  FETCHING_SHOP_REQUEST,
  FETCHING_SHOP_SUCCESS,
  FETCHING_SHOP_FAILURE,
  EDITING_SHOP_REQUEST,
  EDITING_SHOP_SUCCESS,
  EDITING_SHOP_FAILURE,
  SELECT_IMAGE_FILE_CHANGED,
  IMAGE_URI_CHANGED,
  SHOP_SHOP_NAME_INVALID_CHANGED,
  SHOP_SHOP_BRANCH_INVALID_CHANGED,
  SHOP_SHOP_ADDRESS1_INVALID_CHANGED,
  SHOP_SHOP_ADDRESS2_INVALID_CHANGED,
  SHOP_SHOP_ADDRESS3_INVALID_CHANGED,
  SHOP_SHOP_CITY_INVALID_CHANGED,
  SHOP_SHOP_POSTAL_CODE_INVALID_CHANGED,
  SHOP_SHOP_STATE_INVALID_CHANGED,
  SHOP_SHOP_COUNTRY_INVALID_CHANGED,
  SHOP_SHOP_DIRECTORY_INVALID_CHANGED,
  SHOP_SHOP_OPENING_HOUR_INVALID_CHANGED,
  SHOP_SHOP_CLOSING_HOUR_INVALID_CHANGED,
} from '../types';

import * as RootNavigation from '../../RootNavigation';

import {
  storeJWT,
  storeShopId,
  storeUserId,
  storeUserRole,
} from '../../asyncStorage';

export const shopShopNameChanged = (text) => {
  return {
    type: SHOP_SHOP_NAME_CHANGED,
    payload: text,
  };
};

export const shopShopBranchChanged = (text) => {
  return {
    type: SHOP_SHOP_BRANCH_CHANGED,
    payload: text,
  };
};

export const shopShopAddress1Changed = (text) => {
  return {
    type: SHOP_SHOP_ADDRESS1_CHANGED,
    payload: text,
  };
};

export const shopShopAddress2Changed = (text) => {
  return {
    type: SHOP_SHOP_ADDRESS2_CHANGED,
    payload: text,
  };
};

export const shopShopAddress3Changed = (text) => {
  return {
    type: SHOP_SHOP_ADDRESS3_CHANGED,
    payload: text,
  };
};

export const shopShopCityChanged = (text) => {
  return {
    type: SHOP_SHOP_CITY_CHANGED,
    payload: text,
  };
};

export const shopShopPostalCodeChanged = (text) => {
  return {
    type: SHOP_SHOP_POSTAL_CODE_CHANGED,
    payload: text,
  };
};

export const shopShopStateChanged = (text) => {
  return {
    type: SHOP_SHOP_STATE_CHANGED,
    payload: text,
  };
};

export const shopShopCountryChanged = (text) => {
  return {
    type: SHOP_SHOP_COUNTRY_CHANGED,
    payload: text,
  };
};

export const shopShopDirectoryChanged = (text) => {
  return {
    type: SHOP_SHOP_DIRECTORY_CHANGED,
    payload: text,
  };
};

export const shopShopOpeningHourChanged = (text) => {
  console.log('enter shopShopOpeningHourChanged');
  return {
    type: SHOP_SHOP_OPENING_HOUR_CHANGED,
    payload: text,
  };
};

export const shopShopClosingHourChanged = (text) => {
  console.log('enter shopShopClosingHourChanged');
  return {
    type: SHOP_SHOP_CLOSING_HOUR_CHANGED,
    payload: text,
  };
};

export const shopShopNameInvalidChanged = (text) => {
  return {
    type: SHOP_SHOP_NAME_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopBranchInvalidChanged = (text) => {
  return {
    type: SHOP_SHOP_BRANCH_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopAddress1InvalidChanged = (text) => {
  return {
    type: SHOP_SHOP_ADDRESS1_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopAddress2InvalidChanged = (text) => {
  return {
    type: SHOP_SHOP_ADDRESS2_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopAddress3InvalidChanged = (text) => {
  return {
    type: SHOP_SHOP_ADDRESS3_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopCityInvalidChanged = (text) => {
  return {
    type: SHOP_SHOP_CITY_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopPostalCodeInvalidChanged = (text) => {
  return {
    type: SHOP_SHOP_POSTAL_CODE_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopStateInvalidChanged = (text) => {
  return {
    type: SHOP_SHOP_STATE_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopCountryInvalidChanged = (text) => {
  return {
    type: SHOP_SHOP_COUNTRY_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopDirectoryInvalidChanged = (text) => {
  return {
    type: SHOP_SHOP_DIRECTORY_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopOpeningHourInvalidChanged = (text) => {
  console.log('enter shopShopOpeningHourChanged');
  return {
    type: SHOP_SHOP_OPENING_HOUR_INVALID_CHANGED,
    payload: text,
  };
};

export const shopShopClosingHourInvalidChanged = (text) => {
  console.log('enter shopShopClosingHourChanged');
  return {
    type: SHOP_SHOP_CLOSING_HOUR_INVALID_CHANGED,
    payload: text,
  };
};

export const selectImageFileChanged = (image) => {
  return {
    type: SELECT_IMAGE_FILE_CHANGED,
    payload: image,
  };
};

export const imageUriChanged = (uri) => {
  return {
    type: IMAGE_URI_CHANGED,
    payload: uri,
  };
};

export const creatingShopRequest = () => {
  console.log('Dispatch creating shop request');
  return {
    type: CREATING_SHOP_REQUEST,
  };
};

export const creatingShopSuccess = (json) => {
  console.log('Create shop success');
  console.log(json.data);
  storeShopId(json.data.shop.shopId);
  return {
    type: CREATING_SHOP_SUCCESS,
    payload: json.data,
  };
};

export const creatingShopFailure = (error) => {
  console.log('Create shop failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: CREATING_SHOP_FAILURE,
    payload: error.response.data.message,
  };
};

export const createhShop = (data) => {
  console.log('creating shop', data.shopName);
  // let formData = new FormData();
  // formData.append('shopName', data.shopName);
  // formData.append('branch', data.branch);
  // formData.append('streetAddress1', data.streetAddress1);
  // formData.append('streetAddress2', data.streetAddress2);
  // formData.append('streetAddress3', data.streetAddress3);
  // formData.append('city', data.city);
  // formData.append('postalCode', data.postalCode);
  // formData.append('state', data.state);
  // formData.append('country', data.country);
  // formData.append('image', {
  //   uri: data.image.uri,
  //   type: data.image.type,
  //   name: data.image.fileName,
  // });
  // formData.append('monOpen', data.openingHour);
  // formData.append('tueOpen', data.openingHour);
  // formData.append('wedOpen', data.openingHour);
  // formData.append('thuOpen', data.openingHour);
  // formData.append('friOpen', data.openingHour);
  // formData.append('satOpen', data.openingHour);
  // formData.append('sunOpen', data.openingHour);
  // formData.append('holOpen', data.openingHour);
  // formData.append('monClose', data.closingHour);
  // formData.append('tueClose', data.closingHour);
  // formData.append('wedClose', data.closingHour);
  // formData.append('thuClose', data.closingHour);
  // formData.append('friClose', data.closingHour);
  // formData.append('satClose', data.closingHour);
  // formData.append('sunClose', data.closingHour);
  // formData.append('holClose', data.closingHour);
  // console.log('image', {
  //   uri: data.image.uri,
  //   type: data.image.type,
  //   name: data.image.fileName,
  // });
  // console.log('formData', formData);
  // let formHeaders = formData.getHeader();
  return async (dispatch) => {
    dispatch(creatingShopRequest());
    try {
      console.log('enter axios');
      // const config = {
      //   method: 'POST',
      //   headers: formData.getHeader(),
      //   //  {
      //   //   authorization: data.jwt,
      //   //   // Accept: 'application/json',
      //   //   'Content-Type':
      //   //     'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
      //   // },
      //   body: formData,
      // };
      // let response = await fetch(baseServerURL + '/shop', config);
      let response = await axios.post(
        baseServerURL + '/shop',
        {
          shopName: data.shopName,
          branch: data.branch,
          streetAddress1: data.streetAddress1,
          streetAddress2: data.streetAddress2,
          streetAddress3: data.streetAddress2,
          city: data.city,
          postalCode: data.postalCode,
          state: data.state,
          country: data.country,
          directory: data.directory,
          imageUrl: '/images/1.jpeg',
          monOpen: data.openingHour,
          tueOpen: data.openingHour,
          wedOpen: data.openingHour,
          thuOpen: data.openingHour,
          friOpen: data.openingHour,
          satOpen: data.openingHour,
          sunOpen: data.openingHour,
          holOpen: data.openingHour,
          monClose: data.closingHour,
          tueClose: data.closingHour,
          wedClose: data.closingHour,
          thuClose: data.closingHour,
          friClose: data.closingHour,
          satClose: data.closingHour,
          sunClose: data.closingHour,
          holClose: data.closingHour,
        },

        {
          headers:
            // formData.getHeader(),
            {
              Authorization: data.jwt,
              Accept: 'application/json',
              'Content-Type': 'application/json',
              // 'Content-Type': 'multipart/form-data',
            },
        },
      );

      console.log('after axios');
      dispatch(creatingShopSuccess(response));
      RootNavigation.navigate('CreateQueuePlan');
    } catch (err) {
      dispatch(creatingShopFailure(err));
    }
  };
};

export const fetchingShopRequest = () => {
  console.log('Dispatch fetching shop request');
  return {
    type: FETCHING_SHOP_REQUEST,
  };
};

export const fetchingShopSuccess = (json) => {
  console.log('Fetch shop success');
  return {
    type: FETCHING_SHOP_SUCCESS,
    payload: json.data,
  };
};

export const fetchingShopFailure = (error) => {
  console.log('Fetch shop failure');
  return {
    type: FETCHING_SHOP_FAILURE,
    payload: error.response.data.message,
  };
};

export const fetchShop = (data) => {
  console.log('fetching shop');
  return async (dispatch) => {
    dispatch(fetchingShopRequest());
    try {
      console.log('before endpoint');
      let response = await axios.get(baseServerURL + `/shop/${data}`, {});
      await dispatch(fetchingShopSuccess(response));
      console.log('response', response.data);
      // RootNavigation.navigate('Home');
    } catch (err) {
      dispatch(fetchingShopFailure(err));
    }
  };
};

export const editingShopRequest = () => {
  console.log('Dispatch editing shop request');
  return {
    type: EDITING_SHOP_REQUEST,
  };
};

export const editingShopSuccess = (json) => {
  console.log('edit shop success');
  console.log(json.data);
  return {
    type: EDITING_SHOP_SUCCESS,
    payload: json.data,
  };
};

export const editingShopFailure = (error) => {
  console.log('edit shop failure');
  console.log(error.response.status);
  console.log(error.response.data.message);
  return {
    type: EDITING_SHOP_FAILURE,
    payload: error.response.data.message,
  };
};

export const edithShop = (data) => {
  console.log('editing shop');
  return async (dispatch) => {
    dispatch(editingShopRequest());
    try {
      let response = await axios.put(
        baseServerURL + `/shop/${data.shopId}`,
        {
          shopName: data.shopName,
          branch: data.branch,
          streetAddress1: data.streetAddress1,
          streetAddress2: data.streetAddress2,
          streetAddress3: data.streetAddress2,
          city: data.city,
          postalCode: data.postalCode,
          state: data.state,
          country: data.country,
          directory: data.directory,
          imageUrl: data.imageUrl,
          monOpen: data.openingHour,
          tueOpen: data.openingHour,
          wedOpen: data.openingHour,
          thuOpen: data.openingHour,
          friOpen: data.openingHour,
          satOpen: data.openingHour,
          sunOpen: data.openingHour,
          holOpen: data.openingHour,
          monClose: data.closingHour,
          tueClose: data.closingHour,
          wedClose: data.closingHour,
          thuClose: data.closingHour,
          friClose: data.closingHour,
          satClose: data.closingHour,
          sunClose: data.closingHour,
          holClose: data.closingHour,
        },
        {
          headers: {
            authorization: data.jwt,
            // Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      dispatch(editingShopSuccess(response));
      RootNavigation.navigate('Shop');
    } catch (err) {
      dispatch(editingShopFailure(err));
    }
  };
};
