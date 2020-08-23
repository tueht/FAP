import {createSlice, createAction, createAsyncThunk} from '@reduxjs/toolkit';
import qs from 'qs';
import setCookie from 'set-cookie-parser';
import cheerio from 'cheerio-without-node-native';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import {persistReducer} from 'redux-persist';

import axios, {defaultHeaders} from '../utils/axios';
import {LOGIN_ENDPOINT} from '../utils/api';

function extractPageState(html) {
	let $ = cheerio.load(html);
	return {
		__VIEWSTATE: $('#__VIEWSTATE').attr('value'),
		__VIEWSTATEGENERATOR: $('#__VIEWSTATEGENERATOR').attr('value'),
		__EVENTVALIDATION: $('#__EVENTVALIDATION').attr('value'),
	};
}

function getAuthStatus(html) {
	let $ = cheerio.load(html);
	return $('#ctl00_mainContent_lblError').text().trim();
}

function isValidAuthStatus(status) {
	return status.includes('System.NullReferenceException: Object');
}

const login = createAsyncThunk('auth/login', async (userInfo, thunkAPI) => {
	let Cookie;
	const postUserInfo = {
		ctl00$mainContent$dllCampus: userInfo.campId + '',
		ctl00$mainContent$txtUser: userInfo.studentNo,
		ctl00$mainContent$txtPass: userInfo.password,
		ctl00$mainContent$btLogin: 'Đăng nhập',
		ctl00$mainContent$chkRemember: true,
	};
	return fetch(LOGIN_ENDPOINT, {
		headers: defaultHeaders,
		credentials: 'omit',
	})
		.then(async (loginPage) => {
			let formData = {
				...extractPageState(await loginPage.text()),
				...postUserInfo,
			};
			const cookie = setCookie.parse(
				setCookie.splitCookiesString(loginPage.headers.map['set-cookie']),
			)[0];
			Cookie = `${cookie.name}=${cookie.value}`;
			return axios.post(LOGIN_ENDPOINT, qs.stringify(formData), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Cookie,
				},
			});
		})
		.then(async (loginPage) => {
			const html = loginPage.data;
			const authStatus = getAuthStatus(html);
			if (!isValidAuthStatus(authStatus)) {
				throw new Error(authStatus);
			}
			const formData = {
				...extractPageState(html),
				...postUserInfo,
			};
			return axios.post(LOGIN_ENDPOINT, qs.stringify(formData), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Cookie,
				},
			});
		})
		.then(async (loginPage) => {
			const html = loginPage.data;
			const authStatus = getAuthStatus(html);
			if (!isValidAuthStatus(authStatus)) {
				throw new Error(authStatus);
			}
			const formData = {
				...extractPageState(html),
				...postUserInfo,
			};
			await axios.post(LOGIN_ENDPOINT, qs.stringify(formData), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Cookie,
				},
			});
			return {
				cookie: Cookie,
				campId: userInfo.campId,
			};
		});
});

const logout = createAction('auth/logout');

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		rememberMe: true,
	},
	reducers: {},
	extraReducers: {
		[logout]: (state, action) => {
			state.cookie = null;
		},

		[login.pending]: (state, action) => {
			const {campId, rememberMe, studentNo, password} = action.meta.arg;
			state.campId = campId;
			state.rememberMe = rememberMe;
			if (rememberMe) {
				state.studentNo = studentNo;
				state.password = password;
			} else {
				state.studentNo = undefined;
				state.password = undefined;
			}
		},
		[login.fulfilled]: (state, action) => {
			state.cookie = action.payload.cookie;
		},
		[login.rejected]: (state, action) => {
			state.cookie = null;
		},
	},
});

export {login, logout};

const sensitiveStorage = createSensitiveStorage({
	keychainService: 'myKeychain',
	sharedPreferencesName: 'mySharedPrefs',
});

const authPersistConfig = {
	key: 'auth',
	storage: sensitiveStorage,
};
export default persistReducer(authPersistConfig, authSlice.reducer);
