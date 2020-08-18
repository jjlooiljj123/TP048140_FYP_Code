import {combineReducers} from 'redux';
import authReducer from './authReducer';
import shopReducer from './shopReducer';
import queueReducer from './queueReducer';

export default combineReducers({
  auth: authReducer,
  shop: shopReducer,
  queue: queueReducer,
});
