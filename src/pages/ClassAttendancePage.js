import React, {useEffect, useState, useMemo} from 'react';
import {View, SectionList, StyleSheet, SafeAreaView} from 'react-native';
import {Text} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import sharedStyles from '../styles';
import PageLoadingComponent from '../components/PageLoadingComponent';
import {fetchCourseAttendances} from '../state/data';
import locale from '../locale';

const getStatusStyle = (status) => {
	if (status === 'Absent') {
		return {
			container: styles.absent,
			text: locale.absent,
		};
	}
	if (status === 'Present') {
		return {
			container: styles.present,
			text: locale.present,
		};
	}
	return {
		container: styles.notTaken,
		text: locale.notTaken,
	};
};
const ClassAttendancePage = ({route}) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [attendances, setAttendances] = useState([]);

	const {course, semester} = route.params;

	useEffect(() => {
		setLoading(true);
		dispatch(
			fetchCourseAttendances({
				semester,
				subjectCode: course.SubjectCode,
				className: course.ClassName,
			}),
		)
			.then((action) => {
				setAttendances(action.payload);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [course, semester, dispatch]);

	const renderItem = ({item, section}) => {
		if (item === 'loading') {
			return <PageLoadingComponent numOfRows={3} />;
		}
		const statusInfo = getStatusStyle(item.AttendanceStatus);
		return (
			<View style={[sharedStyles.card, styles.item]}>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>{locale.date}:</Text>
					<Text style={[styles.rowText]}>{moment(item.Date).format('L')}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>{locale.slot}:</Text>
					<Text style={[styles.rowText]}>{item.Slot}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>{locale.lecturer}:</Text>
					<Text style={[styles.rowText]}>{item.Lecturer}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>{locale.status}:</Text>
					<View style={[sharedStyles.tag, styles.tag, statusInfo.container]}>
						<Text style={[styles.rowText]}>{statusInfo.text}</Text>
					</View>
				</View>
				<Text style={[styles.rowText, styles.label]}>{locale.note}:</Text>
				{!!item.Comment && (
					<Text style={[styles.rowText, styles.note]}>{item.Comment}</Text>
				)}
			</View>
		);
	};
	const sections = useMemo(() => {
		if (loading) {
			return [
				{
					data: ['loading'],
				},
			];
		}
		const attendanceGroup = _.groupBy(attendances, 'Date');
		return Object.keys(attendanceGroup).map((date) => {
			return {
				title: _.capitalize(moment(date).format('dddd, DD/MM')),
				data: attendanceGroup[date],
			};
		});
	}, [loading, attendances]);
	const renderNoContent = () => {
		return (
			<View style={styles.emptySection}>
				<Text style={[styles.emptyText]}>{locale.noSlotMessage}</Text>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={[sharedStyles.card, {marginVertical: 8}]}>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText]}>{locale.subjectName}:</Text>
					<Text style={[styles.rowText]}>{course.SubjectName}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText]}>{locale.semester}:</Text>
					<Text style={[styles.rowText]}>{semester}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText]}>{locale.startDate}:</Text>
					<Text style={[styles.rowText]}>{course.StartDate}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText]}>{locale.endDate}:</Text>
					<Text style={[styles.rowText]}>{course.EndDate}</Text>
				</View>
			</View>
			<SectionList
				sections={sections}
				keyExtractor={(item, index) => `${item.ScheduleID}-${index}`}
				renderItem={renderItem}
				ListEmptyComponent={renderNoContent}
				renderSectionHeader={({section: {title}}) => (
					<Text style={styles.header}>{title}</Text>
				)}
				keyboardShouldPersistTaps="handled"
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	item: {
		marginTop: 12,
	},
	emptySection: {
		paddingVertical: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyText: {
		color: '#888',
	},
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	rowText: {
		fontSize: 17,
		lineHeight: 24,
	},
	note: {
		fontStyle: 'italic',
	},
	label: {
		color: '#666',
	},
	sectionHeader: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#aed581',
		borderBottomWidth: 1,
		borderBottomColor: 'white',
	},
	sectionHeaderText: {
		fontSize: 19,
		fontWeight: '500',
	},
	tag: {
		marginTop: 2,
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
	passedHeader: {},
	activeHeader: {
		backgroundColor: '#aed581',
	},
	futureHeader: {
		backgroundColor: '#b3e5fc',
	},
	noCourseText: {
		color: '#888',
		paddingTop: 20,
		paddingBottom: 12,
		paddingHorizontal: 4,
		textAlign: 'center',
	},

	header: {
		fontSize: 18,
		backgroundColor: '#aed581',
		paddingHorizontal: 16,
		paddingVertical: 6,
	},
});
export default ClassAttendancePage;
