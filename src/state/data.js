import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import _ from 'lodash';
import qs from 'qs';

import axios from '../utils/axios';
import {logout, updatePageState, extractPageState} from './auth';

import {
	PARENTS_ENDPOINT,
	PARENT_SCHEDULE_ENDPOINT,
	PARENT_TUITION_FEE_ENDPOINT,
	PARENT_TOTAL_TRANSCRIPT_ENDPOINT,
	PARENT_ATTENDANCE_ENDPOINT,
	API_URI_ROOT,
} from '../utils/api';
import {
	parseHomePage,
	parseSchedulePage,
	parseTuitionFeePage,
	parseTotalTranscriptPage,
	parseAttendancePage,
	parseNewPage,
} from '../utils/appParsers';

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
const hasInvalidResponse = (html) => html.includes('Mật khẩu');

async function defaultPayloadCreator(data, thunkApi, apiEndpoint, parser) {
	const {getState, dispatch} = thunkApi;
	const state = getState();
	const cookie = _.get(state, 'auth.cookie');
	let response = await axios.get(apiEndpoint, {
		headers: {
			Cookie: cookie,
		},
	});
	if (!hasInvalidResponse(response.data)) {
		await sleep(200);
		response = await axios.get(apiEndpoint, {
			headers: {
				Cookie: cookie,
			},
		});
	}
	const html = response.data;
	if (hasInvalidResponse(html)) {
		dispatch(logout());
		return null;
	}
	return parser(html, data);
}

const fetchStudentProfile = createAsyncThunk(
	'data/studentProfile',
	async (data, thunkApi) =>
		defaultPayloadCreator(data, thunkApi, PARENTS_ENDPOINT, parseHomePage),
);

async function schedulePayloadCreator(data, thunkApi, apiEndpoint, parser) {
	const {getState, dispatch} = thunkApi;
	const state = getState();
	const cookie = _.get(state, 'auth.cookie');
	let response;
	if (data.weekNumber) {
		const pageState = _.get(state, 'auth.pageState');
		const postData = {
			ctl00$mainContent$drpSelectWeek: String(data.weekNumber),
			...pageState,
			__EVENTTARGET: 'ctl00$mainContent$drpSelectWeek',
		};
		response = await axios.post(apiEndpoint, qs.stringify(postData), {
			headers: {
				Cookie: cookie,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
	} else {
		response = await axios.get(apiEndpoint, {
			headers: {
				Cookie: cookie,
			},
		});
	}

	const html = response.data;
	if (hasInvalidResponse(html)) {
		dispatch(logout());
		return null;
	}
	dispatch(updatePageState(extractPageState(html)));
	return parser(html, data);
}

const fetchSchedule = createAsyncThunk(
	'data/fetchSchedule',
	async (data, thunkApi) =>
		schedulePayloadCreator(
			data,
			thunkApi,
			PARENT_SCHEDULE_ENDPOINT,
			parseSchedulePage,
		),
);

const fetchTuitionFee = createAsyncThunk(
	'data/fetchTuitionFee',
	async (data, thunkApi) =>
		defaultPayloadCreator(
			data,
			thunkApi,
			PARENT_TUITION_FEE_ENDPOINT,
			parseTuitionFeePage,
		),
);

const fetchTotalTranscripts = createAsyncThunk(
	'data/fetchTotalTranscripts',
	async (data, thunkApi) =>
		defaultPayloadCreator(
			data,
			thunkApi,
			PARENT_TOTAL_TRANSCRIPT_ENDPOINT,
			parseTotalTranscriptPage,
		),
);

const fetchNewsDetails = createAsyncThunk(
	'data/fetchNewsDetails',
	async (data, thunkApi) =>
		defaultPayloadCreator(
			data,
			thunkApi,
			`${API_URI_ROOT}${data.url}`,
			parseNewPage,
		),
);

// attendance
async function attendancePayloadCreator(
	data = {},
	thunkApi,
	apiEndpoint,
	parser,
) {
	const {getState, dispatch} = thunkApi;
	const state = getState();
	const cookie = _.get(state, 'auth.cookie');
	const params = {
		id: _.get(state, 'data.student.studentNo'),
		campus: _.get(state, 'auth.campId'),
	};
	if (data.termId) {
		params.term = data.termId;
	}
	if (data.courseId) {
		params.course = data.courseId;
	}
	const url = `${apiEndpoint}${qs.stringify(params, {addQueryPrefix: true})}`;
	// console.log('url', url);
	const response = await axios.get(url, {
		headers: {
			Cookie: cookie,
		},
	});

	const html = response.data;
	if (hasInvalidResponse(html)) {
		dispatch(logout());
		return null;
	}
	return parser(html, data);
}

const fetchAttendance = createAsyncThunk(
	'data/fetchAttendance',
	async (data, thunkApi) =>
		attendancePayloadCreator(
			data,
			thunkApi,
			PARENT_ATTENDANCE_ENDPOINT,
			parseAttendancePage,
		),
);

const initialState = {
	student: {},
	news: [],
	schedule: {},
	tuitionFee: {},
	totalTranscripts: {},
	attendance: {},
};
const dataSlice = createSlice({
	name: 'data',
	initialState,
	reducers: {},
	extraReducers: {
		[logout]: () => {
			return initialState;
		},

		[fetchStudentProfile.pending]: (state, action) => {
			state.student.loading = true;
		},
		[fetchStudentProfile.fulfilled]: (state, action) => {
			// console.log('fullfiled', action.payload);
			if (action.payload) {
				state.student = action.payload.student;
				state.news = action.payload.news;
				state.schoolFeeAnn = action.payload.schoolFeeAnn;
			}
			state.student.loading = false;
		},
		[fetchStudentProfile.rejected]: (state, action) => {
			state.student.loading = false;
		},

		[fetchSchedule.pending]: (state, action) => {
			state.schedule.loading = true;
		},
		[fetchSchedule.fulfilled]: (state, action) => {
			if (action.payload) {
				const {weekNumber, days} = action.payload;
				state.schedule.activeWeek = weekNumber;
				state.schedule[`${weekNumber}`] = days;
			}
			state.schedule.loading = false;
		},
		[fetchSchedule.rejected]: (state, action) => {
			state.schedule.loading = false;
		},

		[fetchTuitionFee.pending]: (state, action) => {
			state.tuitionFee.loading = true;
		},
		[fetchTuitionFee.fulfilled]: (state, action) => {
			state.tuitionFee = {
				loading: false,
				data: action.payload || [],
			};
		},
		[fetchTuitionFee.rejected]: (state, action) => {
			state.tuitionFee.loading = false;
		},

		[fetchTotalTranscripts.pending]: (state, action) => {
			state.totalTranscripts.loading = true;
		},
		[fetchTotalTranscripts.fulfilled]: (state, action) => {
			state.totalTranscripts = {
				loading: false,
				data: action.payload || [],
			};
		},
		[fetchTotalTranscripts.rejected]: (state, action) => {
			state.totalTranscripts.loading = false;
		},

		[fetchAttendance.pending]: (state, action) => {
			state.attendance.loading = true;
		},
		[fetchAttendance.fulfilled]: (state, action) => {
			state.attendance = {
				loading: false,
				data: action.payload || [],
			};
		},
		[fetchAttendance.rejected]: (state, action) => {
			state.attendance.loading = false;
		},

		[fetchNewsDetails.pending]: (state, action) => {
			const currentItem = _.find(state.news, {id: action.meta.arg.id});
			currentItem.loading = true;
		},
		[fetchNewsDetails.fulfilled]: (state, action) => {
			const {html, newItem} = action.payload;
			const currentItem = _.find(state.news, {id: newItem.id});
			currentItem.html = html;
			currentItem.loading = false;
		},
		[fetchNewsDetails.rejected]: (state, action) => {
			const currentItem = _.find(state.news, {id: action.meta.arg.id});
			currentItem.loading = false;
		},
	},
});

export {
	fetchStudentProfile,
	fetchSchedule,
	fetchTuitionFee,
	fetchTotalTranscripts,
	fetchAttendance,
	fetchNewsDetails,
};

export default dataSlice.reducer;
