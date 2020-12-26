import {createSlice, createAction, createAsyncThunk} from '@reduxjs/toolkit';
import qs from 'qs';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import {persistReducer} from 'redux-persist';

import axios from '../utils/axios';
import {LOGIN_ENDPOINT} from '../utils/api';

export const login = createAsyncThunk(
	'auth/login',
	async (userInfo, thunkAPI) => {
		const params = {
			CampusCode: userInfo.campusCode,
			UserName: userInfo.userName,
			Password: userInfo.password,
		};
		const response = await axios.get(
			`${LOGIN_ENDPOINT}?${qs.stringify(params, {encode: false})}`,
		);

		const data = response.data;
		if (data.status !== 200) {
			throw new Error(data.error_message);
		}
		const student = data.data[0];
		return {
			studentNo: student.RollNumber,
			studentName: student.StudentName,
			email: student.Email,
			authKey: student.AuthenKey,
			accountType: student.TypeAcc,
		};
	},
);

export const logout = createAction('auth/logout');

const initialState = {
	rememberMe: true,
};
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: {
		[logout]: (state, action) => {
			state.authKey = undefined;
		},
		[login.pending]: (state, action) => {
			const {campusCode, rememberMe, userName, password} = action.meta.arg;
			state.campusCode = campusCode;
			state.userName = userName;
			state.rememberMe = rememberMe;
			state.password = rememberMe ? password : undefined;
		},
		[login.fulfilled]: (state, action) => {
			const authInfo = action.payload;
			state.studentName = authInfo.studentName;
			state.email = authInfo.email;
			state.authKey = authInfo.authKey;
			state.accountType = authInfo.accountType;
			state.studentNo = authInfo.studentNo;
		},
		[login.rejected]: (state, action) => {
			// return initialState;
		},
	},
});

const sensitiveStorage = createSensitiveStorage({
	keychainService: 'myKeychain',
	sharedPreferencesName: 'mySharedPrefs',
});

const authPersistConfig = {
	key: 'auth',
	storage: sensitiveStorage,
};
export default persistReducer(authPersistConfig, authSlice.reducer);
