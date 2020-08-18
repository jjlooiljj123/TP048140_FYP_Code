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

const INITIAL_STATE = {
  isFetching: '',
  shopShopImageUrl: null,
  shopImageFile: null,
  shopShopName: '',
  shopShopBranch: '',
  shopShopAddress1: '',
  shopShopAddress2: '',
  shopShopAddress3: '',
  shopCity: '',
  shopPostalCode: '',
  shopState: '',
  shopCountry: '',
  shopDirectory: '',
  shopOpneningHour: '',
  shopClosingHour: '',
  createShopError: '',
  shop: {},
  fetchingShopError: '',
  editingShopError: '',
  shopShopNameInvalid: 'Required',
  shopShopBranchInvalid: 'Required',
  shopShopAddress1Invalid: 'Required',
  shopShopAddress2Invalid: '',
  shopShopAddress3Invalid: '',
  shopCityInvalid: 'Required',
  shopPostalCodeInvalid: 'Required',
  shopStateInvalid: 'Required',
  shopCountryInvalid: 'Required',
  shopDirectoryInvalid: 'Required',
  shopOpneningHourInvalid: 'Required',
  shopClosingHourInvalid: 'Required',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_IMAGE_FILE_CHANGED:
      return {...state, shopImageFile: action.payload};
    case IMAGE_URI_CHANGED:
      return {...state, shopShopImageUrl: action.payload};
    case SHOP_SHOP_NAME_CHANGED:
      return {...state, shopShopName: action.payload};
    case SHOP_SHOP_BRANCH_CHANGED:
      return {...state, shopShopBranch: action.payload};
    case SHOP_SHOP_ADDRESS1_CHANGED:
      return {...state, shopShopAddress1: action.payload};
    case SHOP_SHOP_ADDRESS2_CHANGED:
      return {...state, shopShopAddress2: action.payload};
    case SHOP_SHOP_ADDRESS3_CHANGED:
      return {...state, shopShopAddress3: action.payload};
    case SHOP_SHOP_CITY_CHANGED:
      return {...state, shopCity: action.payload};
    case SHOP_SHOP_POSTAL_CODE_CHANGED:
      return {...state, shopPostalCode: action.payload};
    case SHOP_SHOP_STATE_CHANGED:
      return {...state, shopState: action.payload};
    case SHOP_SHOP_COUNTRY_CHANGED:
      return {...state, shopCountry: action.payload};
    case SHOP_SHOP_DIRECTORY_CHANGED:
      return {...state, shopDirectory: action.payload};
    case SHOP_SHOP_OPENING_HOUR_CHANGED:
      return {...state, shopOpneningHour: action.payload};
    case SHOP_SHOP_CLOSING_HOUR_CHANGED:
      return {...state, shopClosingHour: action.payload};
    case SHOP_SHOP_NAME_INVALID_CHANGED:
      return {...state, shopShopNameInvalid: action.payload};
    case SHOP_SHOP_BRANCH_INVALID_CHANGED:
      return {...state, shopShopBranchInvalid: action.payload};
    case SHOP_SHOP_ADDRESS1_INVALID_CHANGED:
      return {...state, shopShopAddress1Invalid: action.payload};
    case SHOP_SHOP_ADDRESS2_INVALID_CHANGED:
      return {...state, shopShopAddress2Invalid: action.payload};
    case SHOP_SHOP_ADDRESS3_INVALID_CHANGED:
      return {...state, shopShopAddress3Invalid: action.payload};
    case SHOP_SHOP_CITY_INVALID_CHANGED:
      return {...state, shopCityInvalid: action.payload};
    case SHOP_SHOP_POSTAL_CODE_INVALID_CHANGED:
      return {...state, shopPostalCodeInvalid: action.payload};
    case SHOP_SHOP_STATE_INVALID_CHANGED:
      return {...state, shopStateInvalid: action.payload};
    case SHOP_SHOP_COUNTRY_INVALID_CHANGED:
      return {...state, shopCountryInvalid: action.payload};
    case SHOP_SHOP_DIRECTORY_INVALID_CHANGED:
      return {...state, shopDirectoryInvalid: action.payload};
    case SHOP_SHOP_OPENING_HOUR_INVALID_CHANGED:
      return {...state, shopOpneningHourInvalid: action.payload};
    case SHOP_SHOP_CLOSING_HOUR_INVALID_CHANGED:
      return {...state, shopClosingHourInvalid: action.payload};
    case CREATING_SHOP_REQUEST:
      return {...state, isFetching: true};
    case CREATING_SHOP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        shopShopName: action.payload.shopName,
        // shopShopImageUrl: '/images/1.jpeg',
        shopShopImageUrl: action.payload.imageUrl,
        shopShopBranch: action.payload.branch,
        shopShopAddress1: action.payload.streetAddress1,
        shopShopAddress2: action.payload.streetAddress2,
        shopShopAddress3: action.payload.streetAddress13,
        shopCity: action.payload.city,
        shopPostalCode: action.payload.postalCode,
        shopState: action.payload.state,
        shopCountry: action.payload.country,
        shopDirectory: action.payload.directory,
        shopOpneningHour: action.payload.monOpen,
        shopClosingHour: action.payload.monClose,
        createShopError: '',
      };
    case CREATING_SHOP_FAILURE:
      return {...state, isFetching: false, createShopError: action.payload};
    case FETCHING_SHOP_REQUEST:
      return {...state, isFetching: true};
    case FETCHING_SHOP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        shop: action.payload.shop,
        shopShopName: action.payload.shop.shop_shopName,
        shopShopImageUrl: action.payload.shop.shop_imageUrl,
        shopShopBranch: action.payload.shop.shop_branch,
        shopShopAddress1: action.payload.shop.shop_streetAddress1,
        shopShopAddress2: action.payload.shop.shop_streetAddress2,
        shopShopAddress3: action.payload.shop.shop_streetAddress3,
        shopCity: action.payload.shop.shop_city,
        shopPostalCode: action.payload.shop.shop_postalCode,
        shopState: action.payload.shop.shop_state,
        shopCountry: action.payload.shop.shop_country,
        shopDirectory: action.payload.shop.shop_directory,
        shopOpneningHour: action.payload.shop.shop_monOpen,
        shopClosingHour: action.payload.shop.shop_monClose,
        fetchingShopError: '',
      };
    case FETCHING_SHOP_FAILURE:
      return {...state, isFetching: false, fetchingShopError: action.payload};
    case EDITING_SHOP_REQUEST:
      return {...state, isFetching: true};
    case EDITING_SHOP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        shop: action.payload.shop,
        shopShopName: action.payload.shop.shop_shopName,
        shopShopImageUrl: action.payload.shop.shop_imageUrl,
        shopShopBranch: action.payload.shop.shop_branch,
        shopShopAddress1: action.payload.shop.shop_streetAddress1,
        shopShopAddress2: action.payload.shop.shop_streetAddress2,
        shopShopAddress3: action.payload.shop.shop_streetAddress3,
        shopCity: action.payload.shop.shop_city,
        shopPostalCode: action.payload.shop.shop_postalCode,
        shopState: action.payload.shop.shop_state,
        shopCountry: action.payload.shop.shop_country,
        shopDirectory: action.payload.shop.shop_directory,
        shopOpneningHour: action.payload.shop.shop_monOpen,
        shopClosingHour: action.payload.shop.shop_monClose,
        editingShopError: '',
      };
    case EDITING_SHOP_FAILURE:
      return {...state, isFetching: false, editingShopError: action.payload};

    default:
      return state;
  }
};
