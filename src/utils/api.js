export const API_URI_ROOT = 'http://fap.fpt.edu.vn/mApi.asmx/';

export const LOGIN_ENDPOINT = API_URI_ROOT + 'AuthenticationByUsername';
export const LOGIN_GOOGLE_ENDPOINT =
	API_URI_ROOT + 'AuthenticationByGoogleAccessToken'; // token

export const GET_CAMPUS_ENDPOINT = API_URI_ROOT + 'GetAllActiveCampus';
export const GET_SEMESTERS_ENDPOINT = API_URI_ROOT + 'GetSemester';
export const GET_NEWS_ENDPOINT = API_URI_ROOT + 'GetTop10News';
export const GET_SEARCH_NEWS_ENDPOINT = API_URI_ROOT + 'SearchNews'; // type, keysearch, headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}
export const GET_SUBJECTS_ENDPOINT = API_URI_ROOT + 'GetSubjets';
export const GET_ATTENDANCES_ENDPOINT = API_URI_ROOT + 'GetActivityStudent';
export const GET_INVOICES_ENDPOINT = API_URI_ROOT + 'GeFeeByRoll';
export const GET_COURSES_ENDPOINT = API_URI_ROOT + 'GetCourseOfSemester';

export const GET_BALANCE_ENDPOINT = API_URI_ROOT + 'GetBalance';
export const GET_APPLICATIONS_ENDPOINT = API_URI_ROOT + 'GetApplication';
export const GET_STUDENT_GRADES_ENDPOINT = API_URI_ROOT + 'GetStudentMark'; // StudentCode, semester
export const GET_EXTRACURRICULAR_GRADES_ENDPOINT =
	API_URI_ROOT + 'GetDiemphongtrao'; // roolNumber, semester
export const GET_EXAM_SCHEDULE_ENDPOINT = API_URI_ROOT + 'GetScheduleExam'; // StudentCode, semester
export const GET_STUDENT_PROFILE_ENDPOINT = API_URI_ROOT + 'GetStudentById'; // rollNumber
export const GET_STUDENT_IMAGE_ENDPOINT = API_URI_ROOT + 'RetriveImage'; // rollNumber
export const GET_CAMPUS_INFO_ENDPOINT = API_URI_ROOT + 'GetCampusInfo';
export const CHECK_OPEN_FEEDBACKS_ENDPOINT = API_URI_ROOT + 'CheckOpenFeedBack';
export const GET_STUDENT_NOTIFICATIONS_ENDPOINT =
	API_URI_ROOT + 'GetNotificationByRoll';
export const GET_GUARDIAN_NOTIFICATIONS_ENDPOINT =
	API_URI_ROOT + 'GetNotificationByDonor';

export const GET_OPEN_FEEDBACKS_ENDPOINT = API_URI_ROOT + 'GetStudentRate';
export const SEND_FEEDBACK_ENDPOINT = API_URI_ROOT + 'AddRate'; // rateid, rateValue, rateComment
export const GET_ATTENDED_SEMESTERS_ENDPOINT = API_URI_ROOT + 'GetSemesterMark';
export const GET_TRANSCRIPTS_ENDPOINT = API_URI_ROOT + 'AcademicTranscript'; // roll
export const GET_COURSE_GRADES_ENDPOINT = API_URI_ROOT + 'GetMarkByCourse'; // CourseId, rollNumber
export const GET_COURSE_ATTENDANCES_ENDPOINT =
	API_URI_ROOT + 'getCourseAttendance'; // rollNumber, Semester, SubjectCode, ClassName
export const GET_STUDENT_ATTENDANCES_ENDPOINT =
	API_URI_ROOT + 'GetStudentAttendances'; // StudentCode, Semester
export {};
