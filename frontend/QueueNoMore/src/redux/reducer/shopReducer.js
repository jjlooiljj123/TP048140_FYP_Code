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

const INITIAL_STATE = {
  search_shop: '',
  isFetching: false,
  shops: [],
  filteredShops: [],
  searchShopPageFetchingError: '',
  shop: {},
  QueueNowPageFetchingError: '',
  shopActivities: [],
  shopInfo: {},
  shopInfoFetchingError: '',
  queueLengthFilter: 99999,
  beautySalonOption: false,
  foodOption: false,
  hairSalonOption: false,
  medicalOption: false,
  telecommunicationOption: false,
  clearOption: false,
  selectedOption: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_QUEUE_LENGTH_CHANGED:
      return {...state, queueLengthFilter: action.payload};
    case BEAUTY_SALON_CHECKED:
      return {
        ...state,
        beautySalonOption: true,
        foodOption: false,
        hairSalonOption: false,
        medicalOption: false,
        telecommunicationOption: false,
        clearOption: false,
        selectedOption: action.payload,
      };
    case FOOD_CHECKED:
      return {
        ...state,
        beautySalonOption: false,
        foodOption: true,
        hairSalonOption: false,
        medicalOption: false,
        telecommunicationOption: false,
        clearOption: false,
        selectedOption: action.payload,
      };
    case HAIR_SALON_CHECKED:
      return {
        ...state,
        beautySalonOption: false,
        foodOption: false,
        hairSalonOption: true,
        medicalOption: false,
        telecommunicationOption: false,
        clearOption: false,
        selectedOption: action.payload,
      };
    case MEDICAL_CHECKED:
      return {
        ...state,
        beautySalonOption: false,
        foodOption: false,
        hairSalonOption: false,
        medicalOption: true,
        telecommunicationOption: false,
        clearOption: false,
        selectedOption: action.payload,
      };
    case TELEMCOMMUNICATION_CHECKED:
      return {
        ...state,
        beautySalonOption: false,
        foodOption: false,
        hairSalonOption: false,
        medicalOption: false,
        telecommunicationOption: true,
        clearOption: false,
        selectedOption: action.payload,
      };
    case CLEAR_CHECKED:
      return {
        ...state,
        beautySalonOption: false,
        foodOption: false,
        hairSalonOption: false,
        medicalOption: false,
        telecommunicationOption: false,
        clearOption: true,
        selectedOption: null,
      };
    case SSEARCH_SHOP_CHANGED:
      return {
        ...state,
        search_shop: action.payload.text,
        filteredShops: action.payload.newArray,
      };
    case FETCHING_ALL_SHOPS_REQUEST:
      return {...state, isFetching: true};
    case FETCHING_ALL_SHOPS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        shops: action.payload.shopStatus,
        searchShopPageFetchingError: '',
      };
    case FETCHING_ALL_SHOPS_FAILURE:
      return {
        ...state,
        isFetching: false,
        searchShopPageFetchingError: action.payload,
      };
    case FILTER_SHOP_REQUEST:
      return {...state, isFetching: true};
    case FILTER_SHOP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        shops: action.payload.shopStatus,
        searchShopPageFetchingError: '',
      };
    case FILTER_SHOP_FAILURE:
      return {
        ...state,
        isFetching: false,
        searchShopPageFetchingError: action.payload,
      };
    case FETCHING_SHOP_REQUEST:
      return {...state, isFetching: true};
    case FETCHING_SHOP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        shop: action.payload.shopStatus,
        QueueNowPageFetchingError: '',
        shopActivities: action.payload.shopActivities,
      };
    case FETCHING_SHOP_FAILURE:
      return {
        ...state,
        isFetching: false,
        QueueNowPageFetchingError: action.payload,
      };
    case FETCHING_SHOP_INFO_REQUEST:
      return {...state, isFetching: true};
    case FETCHING_SHOP_INFO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        shopInfo: action.payload.shop,
        shopInfoFetchingError: '',
      };
    case FETCHING_SHOP_INFO_FAILURE:
      return {
        ...state,
        isFetching: false,
        shopInfoFetchingError: action.payload,
      };
    case IO_UPDATE_SPECIFIC_SHOP_INFO:
      return {
        ...state,
        shops: action.payload,
      };
    case IO_UPDATE_VIEWING_SHOP_INFO:
      return {
        ...state,
        shop: action.payload,
      };
    default:
      return state;
  }
};
