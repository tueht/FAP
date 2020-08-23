import {combineReducers} from '@reduxjs/toolkit';

import auth from './auth';
import data from './data';

export default combineReducers({
	auth,
	data,
});
