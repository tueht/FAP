import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {useSelector} from 'react-redux';

import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import SchedulePage from '../pages/SchedulePage';
import TuitionFeePage from '../pages/TuitionFeePage';
import TotalTranscriptPage from '../pages/TotalTranscriptPage';
import AttendancePage from '../pages/AttendancePage';
import ClassAttendancePage from '../pages/ClassAttendancePage';
import SemesterGradesPage from '../pages/SemesterGradesPage';
import CourseGradesPage from '../pages/CourseGradesPage';
import NewPage from '../pages/NewPage';
import locale from '../locale';

const Stack = createStackNavigator();

require('moment/locale/vi');

const AppRouter = () => {
	const isLoggedIn = useSelector((state) => state.auth.authKey);
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{isLoggedIn ? (
					<>
						<Stack.Screen
							name="Home"
							component={HomePage}
							options={{title: 'FU Academic Portal'}}
						/>
						<Stack.Screen
							name="Schedule"
							component={SchedulePage}
							options={{title: locale.weeklySchedule, headerBackTitle: ' '}}
						/>
						<Stack.Screen
							name="TuitionFee"
							component={TuitionFeePage}
							options={{title: locale.tuitionFee, headerBackTitle: ' '}}
						/>
						<Stack.Screen
							name="TotalTranscript"
							component={TotalTranscriptPage}
							options={{title: locale.semesterGrades, headerBackTitle: ' '}}
						/>
						<Stack.Screen
							name="Attendance"
							component={AttendancePage}
							options={{title: locale.attendanceDetails, headerBackTitle: ' '}}
						/>
						<Stack.Screen
							name="ClassAttendancePage"
							component={ClassAttendancePage}
							options={{title: locale.attendance, headerBackTitle: ' '}}
						/>

						<Stack.Screen
							name="SemesterGrades"
							component={SemesterGradesPage}
							options={{title: locale.grades, headerBackTitle: ' '}}
						/>
						<Stack.Screen
							name="CourseGrades"
							component={CourseGradesPage}
							options={{title: locale.grades, headerBackTitle: ' '}}
						/>
						<Stack.Screen
							name="New"
							component={NewPage}
							options={{title: locale.news, headerBackTitle: ' '}}
						/>
					</>
				) : (
					<Stack.Screen
						name="Auth"
						component={LoginPage}
						options={{title: locale.login}}
					/>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppRouter;
