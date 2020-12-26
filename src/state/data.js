import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import _ from 'lodash';
import qs from 'qs';
import moment from 'moment';

import axios from '../utils/axios';
import {logout} from './auth';

import * as API from '../utils/api';
import {parseGradePage} from '../utils/appParsers';

async function fetchData(passInParams = {}, thunkApi, apiEndpoint) {
	const {getState} = thunkApi;
	const state = getState();
	const auth = state.auth;
	const params = {
		campusCode: auth.campusCode,
		authen: auth.authKey,
		studentCode: auth.studentNo,
		rollNumber: auth.studentNo,
		roll: auth.studentNo,
		...passInParams,
	};
	const response = await axios.get(
		`${apiEndpoint}?${qs.stringify(params, {encode: false})}`,
	);

	return response.data;
}

function extractJSONFromXML(xml, fallback) {
	const startIndex = xml.indexOf('<string xmlns="http://tempuri.org/">');
	if (startIndex >= 0) {
		const innerData = _.trim(
			xml.substring(startIndex + 36, xml.length - 9),
			'"\\',
		);
		try {
			return JSON.parse(innerData);
		} catch (error) {
			try {
				return JSON.parse(innerData.replace(/\\/g, ''));
			} catch (e) {}
			return innerData;
		}
	}
	return fallback;
}

async function payloadCreator(data = {}, thunkApi, apiEndpoint) {
	const response = await fetchData(data, thunkApi, apiEndpoint);
	if (typeof response === 'string') {
		const json = extractJSONFromXML(response);
		if (json) {
			if (json.status === 403) {
				thunkApi.dispatch(logout());
				throw new Error(json.error_message);
			}
			return json;
		}
	}
	return response;
}

export const fetchSemesters = createAsyncThunk(
	'data/fetchSemesters',
	async (data, thunkApi) => {
		const allSemesters = await payloadCreator(
			data,
			thunkApi,
			API.GET_SEMESTERS_ENDPOINT,
		);
		const attendedSemesters = await payloadCreator(
			data,
			thunkApi,
			API.GET_ATTENDED_SEMESTERS_ENDPOINT,
		);
		const attendedSemesterNames = attendedSemesters.reduce((a, c) => {
			a[c.SemesterName] = true;
			return a;
		}, {});
		return allSemesters.filter(
			(semester) =>
				moment().isBefore(semester.EndDate) ||
				attendedSemesterNames[semester.SemesterName],
		);
	},
);

export const fetchNews = createAsyncThunk(
	'data/news',
	async (data, thunkApi) => {
		const {getState} = thunkApi;
		const params = {
			type: getState().auth.accountType === 'student' ? 1 : 4,
		};
		return payloadCreator(params, thunkApi, API.GET_NEWS_ENDPOINT);
	},
);

export const fetchSubjects = createAsyncThunk(
	'data/fetchSubjects',
	async (data, thunkApi) =>
		payloadCreator(data, thunkApi, API.GET_SUBJECTS_ENDPOINT),
);

export const fetchAttendances = createAsyncThunk(
	'data/fetchAttendances',
	async (data, thunkApi) =>
		payloadCreator(data, thunkApi, API.GET_ATTENDANCES_ENDPOINT),
);
export const fetchInvoices = createAsyncThunk(
	'data/fetchInvoices',
	async (data, thunkApi) =>
		payloadCreator(data, thunkApi, API.GET_INVOICES_ENDPOINT),
);

export const fetchCoursesForSemester = createAsyncThunk(
	'data/fetchCoursesForSemester',
	async (data, thunkApi) =>
		payloadCreator(data, thunkApi, API.GET_COURSES_ENDPOINT),
);

export const fetchGradesForSemester = createAsyncThunk(
	'data/fetchGradesForSemester',
	async (data, thunkApi) =>
		payloadCreator(data, thunkApi, API.GET_STUDENT_GRADES_ENDPOINT),
);

export const fetchCourseAttendances = createAsyncThunk(
	'data/fetchCourseAttendances',
	async (data, thunkApi) =>
		payloadCreator(data, thunkApi, API.GET_COURSE_ATTENDANCES_ENDPOINT),
);
export const fetchTranscripts = createAsyncThunk(
	'data/fetchTranscripts',
	async (data, thunkApi) =>
		payloadCreator(data, thunkApi, API.GET_TRANSCRIPTS_ENDPOINT),
);

export const fetchSemesterGrades = createAsyncThunk(
	'data/fetchSemesterGrades',
	async (data, thunkApi) =>
		payloadCreator(data, thunkApi, API.GET_STUDENT_GRADES_ENDPOINT),
);

export const fetchCourseGrades = createAsyncThunk(
	'data/fetchCourseGrades',
	async (data, thunkApi) => {
		const gradeHtml = await payloadCreator(
			data,
			thunkApi,
			API.GET_COURSE_GRADES_ENDPOINT,
		);
		const parsedDAta = parseGradePage(_.unescape(gradeHtml));
		return parsedDAta;
	},
);

const initialState = {
	news: [],
	totalTranscripts: {},
	attendance: {},
	semesters: {},
	subjects: {},
	invoices: {},
};
const dataSlice = createSlice({
	name: 'data',
	initialState,
	reducers: {},
	extraReducers: {
		[logout]: () => {
			return initialState;
		},

		[fetchSemesters.pending]: (state, action) => {
			if (!state.semesters) {
				state.semesters = {};
			}
			state.semesters.loading = true;
		},
		[fetchSemesters.fulfilled]: (state, action) => {
			if (action.payload) {
				const semesters = action.payload
					.map((item) => ({
						startDate: item.StartDate,
						endDate: item.EndDate,
						termId: item.TermID,
						name: item.SemesterName,
					}))
					.sort((a, b) => moment(a.startDate).isBefore(b.startDate));
				state.semesters.data = semesters;
			}
			state.semesters.loading = false;
		},
		[fetchSemesters.rejected]: (state, action) => {
			state.semesters.loading = false;
		},

		[fetchNews.fulfilled]: (state, action) => {
			const news = action.payload.map((item) => ({
				id: item.NewsId,
				title: item.Tittle,
				content: item.Content,
				createdAt: item.CreateDate,
				expireDate: item.ExpireDate,
				createdBy: item.CreateBy,
				attachments: item.FileAttach,
			}));
			state.news = news;
		},
		[fetchSubjects.fulfilled]: (state, action) => {
			state.subjects = action.payload.reduce((a, c) => {
				a[c.SubjectCode] = c;
				return a;
			}, {});
		},

		[fetchInvoices.pending]: (state, action) => {
			if (!state.invoices) {
				state.invoices = {};
			}
			state.invoices.loading = true;
		},
		[fetchInvoices.fulfilled]: (state, action) => {
			state.invoices.data = action.payload.map((item) => ({
				no: item.InvoiceNo,
				semester: item.TermName,
				createdAt: item.CreateDate,
				invoiceDate: item.InvoiceDate,
				amount: item.Amount,
				note: item.Note,
			}));
			state.invoices.loading = false;
		},
		[fetchInvoices.rejected]: (state, action) => {
			state.invoices.loading = false;
		},

		[fetchAttendances.pending]: (state, action) => {
			state.attendance.loading = true;
		},
		[fetchAttendances.fulfilled]: (state, action) => {
			const subjects = state.subjects;
			state.attendance = {
				loading: false,
				data: action.payload.map((item) => ({
					status: item.AttendanceStatus,
					date: item.Date,
					groupName: item.GroupName,
					lecturer: item.Lecturer,
					roomNo: item.RoomNo,
					sessionNo: item.SessionNo,
					slot: item.Slot,
					slotTime: item.SlotTime,
					subjectCode: item.SubjectCode,
					subjectName:
						subjects[item.SubjectCode]?.SubjectName || item.SubjectCode,
				})),
			};
		},
		[fetchAttendances.rejected]: (state, action) => {
			state.attendance.loading = false;
		},

		[fetchCoursesForSemester.pending]: (state, action) => {
			const semesterName = action.meta.arg.semester;
			const semester = _.find(state.semesters.data, {name: semesterName});
			if (!semester.courses) {
				semester.courses = {};
			}
			semester.courses.loading = true;
		},
		[fetchCoursesForSemester.fulfilled]: (state, action) => {
			const semesterName = action.meta.arg.semester;
			const semester = _.find(state.semesters.data, {name: semesterName});
			semester.courses = {
				loading: false,
				data: action.payload,
			};
		},
		[fetchCoursesForSemester.rejected]: (state, action) => {
			const semesterName = action.meta.arg.semester;
			const semester = _.find(state.semesters.data, {name: semesterName});
			semester.courses = {
				loading: false,
			};
		},

		[fetchGradesForSemester.pending]: (state, action) => {
			const semesterName = action.meta.arg.semester;
			const semester = _.find(state.semesters.data, {name: semesterName});
			if (!semester.grades) {
				semester.grades = {};
			}
			semester.grades.loading = true;
		},
		[fetchGradesForSemester.fulfilled]: (state, action) => {
			const semesterName = action.meta.arg.semester;
			const semester = _.find(state.semesters.data, {name: semesterName});
			semester.grades = {
				loading: false,
				data: action.payload,
			};
		},
		[fetchGradesForSemester.rejected]: (state, action) => {
			const semesterName = action.meta.arg.semester;
			const semester = _.find(state.semesters.data, {name: semesterName});
			semester.grades = {
				loading: false,
			};
		},
	},
});

export const getAllCampus = () => {
	return axios.get(API.GET_CAMPUS_ENDPOINT).then((res) => {
		return res.data.data;
	});
};

export default dataSlice.reducer;
