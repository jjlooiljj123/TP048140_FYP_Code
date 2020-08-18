import {combineReducers} from 'redux';
import authReducer from './authReducer';
import shopReducer from './shopReducer';
import queueReducer from './queueReducer';
import queueStructureReducer from './queueStructureReducer';
import shopStatusReducer from './shopStatusReducer';
import performanceReducer from './performanceReducer';

export default combineReducers({
  auth: authReducer,
  shop: shopReducer,
  queue: queueReducer,
  queueStructure: queueStructureReducer,
  shopStatus: shopStatusReducer,
  performance: performanceReducer,
});
