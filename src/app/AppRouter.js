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
import NewPage from '../pages/NewPage';

const Stack = createStackNavigator();

require('moment/locale/vi');

const AppRouter = () => {
	const isLoggedIn = useSelector((state) => state.auth.cookie);
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
							options={{title: 'Lịch học từng tuần', headerBackTitle: ' '}}
						/>
						<Stack.Screen
							name="TuitionFee"
							component={TuitionFeePage}
							options={{title: 'Tra học phí kỳ', headerBackTitle: ' '}}
						/>
						<Stack.Screen
							name="TotalTranscript"
							component={TotalTranscriptPage}
							options={{title: 'Bảng điểm quá trình học', headerBackTitle: ' '}}
						/>
						<Stack.Screen
							name="Attendance"
							component={AttendancePage}
							options={{title: 'Điểm danh chi tiết', headerBackTitle: ' '}}
						/>
						<Stack.Screen
							name="New"
							component={NewPage}
							options={{title: 'Thông báo', headerBackTitle: ' '}}
						/>
					</>
				) : (
					<Stack.Screen
						name="Auth"
						component={LoginPage}
						options={{title: 'Đăng Nhập'}}
					/>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppRouter;
