import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, SectionList, StyleSheet, SafeAreaView} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import Modal from 'react-native-modal';
import {Calendar, LocaleConfig} from 'react-native-calendars';

import PageLoadingComponent from '../components/PageLoadingComponent';
import sharedStyles from '../styles';
import {fetchSchedule} from '../state/data';

LocaleConfig.locales['vi'] = {
	monthNames: [
		'Tháng 1',
		'Tháng 2',
		'Tháng 3',
		'Tháng 4',
		'Tháng 5',
		'Tháng 6',
		'Tháng 7',
		'Tháng 8',
		'Tháng 9',
		'Tháng 10',
		'Tháng 11',
		'Tháng 12',
	],
	monthNamesShort: [
		'Tháng 1',
		'Tháng 2',
		'Tháng 3',
		'Tháng 4',
		'Tháng 5',
		'Tháng 6',
		'Tháng 7',
		'Tháng 8',
		'Tháng 9',
		'Tháng 10',
		'Tháng 11',
		'Tháng 12',
	],
	dayNames: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
	dayNamesShort: ['CN.', 'T2.', 'T3.', 'T4.', 'T5.', 'T6.', 'T7.'],
	today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vi';

const getStatusStyle = (status) => {
	if (status === 'Vắng mặt') {
		return {
			container: styles.absent,
		};
	}
	if (status === 'Đã điểm danh') {
		return {
			container: styles.present,
		};
	}
	return {
		container: styles.notTaken,
	};
};
const SchedulePage = ({navigation}) => {
	const dispatch = useDispatch();
	const [selectedDate, setSelectedDate] = useState(moment());
	const [calendarVisible, setCalendarVisible] = useState(false);
	const schedule = useSelector((state) => state.data.schedule) || {};

	const scheduleData = schedule[schedule.activeWeek] || [];
	useEffect(() => {
		const params = selectedDate.isSame(moment(), 'day')
			? {}
			: {weekNumber: selectedDate.format('w')};
		dispatch(fetchSchedule(params));
	}, [dispatch, selectedDate]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button
					type="clear"
					icon={{
						name: 'calendar',
						type: 'feather',
						size: 24,
						color: '#42a5f5',
					}}
					containerStyle={styles.headerButtonContainer}
					onPress={() => setCalendarVisible(true)}
				/>
			),
			headerTitle: () => (
				<View style={styles.headerContainer}>
					<Text style={[styles.headerTitle]}>Lịch học từng tuần</Text>
					<Text style={[styles.subtitle]}>Tuần {selectedDate.format('w')}</Text>
				</View>
			),
		});
	}, [navigation, setCalendarVisible, selectedDate]);

	if (schedule.loading) {
		return <PageLoadingComponent numOfRows={2} />;
	}

	const data = scheduleData.map((day) => {
		return {
			title: _.capitalize(moment(day.date).format('dddd, DD/MM')),
			data: day.slots.filter((item) => !!item.subject),
		};
	});

	const renderItem = ({item, section}) => {
		const statusStyles = getStatusStyle(item.status);
		return (
			<View style={[sharedStyles.card, styles.item]}>
				<View style={styles.slotMeta}>
					<Text style={[styles.slot]}>Tiết: {item.slot}</Text>
					<Text style={[styles.subject]}>{item.subject}</Text>
				</View>
				<View>
					<View style={[sharedStyles.tag, statusStyles.container]}>
						<Text>{item.status}</Text>
					</View>
					{!!item.time && <Text style={[styles.time]}>{item.time}</Text>}
				</View>
			</View>
		);
	};
	const renderNoContent = ({section}) => {
		if (section.data.length === 0) {
			return (
				<View style={styles.emptySection}>
					<Text style={[styles.emptyText]}>Không có tiết học nào</Text>
				</View>
			);
		}
		return <View style={{height: 16}} />;
	};
	const renderCalendar = () => {
		const startOfWeek = moment(selectedDate.format('w'), 'w');
		const color = '#50cebb';
		const markedDates = Array(7)
			.fill(0)
			.reduce((a, c, i) => {
				const date = startOfWeek.clone().add(i, 'd').format('yyyy-MM-DD');
				a[date] = {
					color,
					startingDay: i === 0,
					endingDay: i === 6,
				};
				return a;
			}, {});
		return (
			<View style={styles.calendarContainer}>
				<Calendar
					current={selectedDate.format('yyyy-MM-DD')}
					minDate={moment().add(-53, 'w').format('yyyy-MM-DD')}
					maxDate={moment().add(2, 'w').format('yyyy-MM-DD')}
					onDayPress={(day) => {
						setSelectedDate(moment(day.dateString, 'yyyy-MM-DD'));
						setCalendarVisible(false);
					}}
					firstDay={1}
					markedDates={markedDates}
					markingType="period"
				/>
			</View>
		);
	};
	return (
		<SafeAreaView style={styles.container}>
			<SectionList
				sections={data}
				keyExtractor={(item, index) => item.subject + index}
				renderItem={renderItem}
				renderSectionFooter={renderNoContent}
				renderSectionHeader={({section: {title}}) => (
					<Text style={styles.header}>{title}</Text>
				)}
			/>
			<Modal
				isVisible={calendarVisible}
				onBackdropPress={() => setCalendarVisible(false)}>
				{renderCalendar()}
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	item: {
		marginTop: 12,
		flexDirection: 'row',
		alignItems: 'center',
	},
	slotMeta: {
		flex: 1,
		marginRight: 6,
	},
	header: {
		fontSize: 18,
		backgroundColor: '#aed581',
		paddingHorizontal: 16,
		paddingVertical: 6,
	},
	buttonContainer: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		flexDirection: 'row',
		alignItems: 'center',
	},
	emptySection: {
		paddingVertical: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyText: {
		color: '#888',
	},
	slot: {
		fontSize: 16,
	},
	subject: {
		marginTop: 4,
		fontSize: 16,
	},
	absent: {
		backgroundColor: '#ff8f00',
	},
	present: {
		backgroundColor: '#9ccc65',
	},
	notTaken: {
		backgroundColor: '#ccc',
	},
	time: {
		textAlign: 'center',
		marginTop: 3,
		color: '#555',
	},
	headerButtonContainer: {
		paddingRight: 16,
	},
	headerContainer: {
		textAlign: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		fontWeight: '500',
		fontSize: 17,
	},
	subtitle: {
		fontSize: 13,
	},
	calendarContainer: {
		borderRadius: 4,
		overflow: 'hidden',
	},
});

export default SchedulePage;
