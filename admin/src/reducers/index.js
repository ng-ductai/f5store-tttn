import { combineReducers } from 'redux';
import {authReducer} from './auth';
import {userReducer} from './user';

const rootReducer = combineReducers({
  authenticate: authReducer,
  user: userReducer,
});

export default rootReducer;
