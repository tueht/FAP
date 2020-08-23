import React, {useEffect, useState, useMemo} from 'react';
import {View, SectionList, StyleSheet, SafeAreaView} from 'react-native';
import {Text, Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {Dropdown} from 'react-native-material-dropdown-v2';
import _ from 'lodash';
import moment from 'moment';

import sharedStyles from '../styles';
import PageLoadingComponent from '../components/PageLoadingComponent';
import {fetchAttendance} from '../state/data';

const getAttendanceStyle = (status) => {
	if (status === 'Đã điểm danh') {
		return styles.present;
	}
	if (status === 'Vắng mặt') {
		return styles.absent;
	}
	return styles.notTaken;
};

const AttendancePage = () => {
	const dispatch = useDispatch();
	const attendance = useSelector((state) => state.data.attendance);

	const [term, setTerm] = useState(null);
	const [course, setCourse] = useState(null);

	useEffect(() => {
		dispatch(
			fetchAttendance({
				termId: term?.id,
				courseId: course?.id,
			}),
		);
	}, [dispatch, term, course]);

	useEffect(() => {
		if (attendance.data) {
			const activeTerm = term || _.first(attendance.data);
			if (!term && activeTerm) {
				setTerm(activeTerm);
				setCourse(_.last(activeTerm.courses));
			}
		}
	}, [attendance.data, term, course]);

	const data = useMemo(() => {
		if (attendance.loading) {
			return [
				{
					data: ['loading'],
				},
			];
		}
		const currentTerm = _.find(attendance.data, {id: term?.id}) || {};
		const currentCourse = _.find(currentTerm.courses, (val) => {
			return val?.id === course?.id || (!val?.id && !course?.id);
		});
		// console.log('course xx', currentCourse);
		const attendances = currentCourse?.attendances || [];
		const weekGroup = _.groupBy(attendances, (item) =>
			moment(item.date, 'DD/MM/YYYY').format('w'),
		);
		const weeks = Object.keys(weekGroup);
		return weeks.map((week) => ({
			title: week,
			data: weekGroup[week],
		}));
	}, [term, course, attendance]);

	const renderItem = ({item, section}) => {
		if (item === 'loading') {
			return <PageLoadingComponent numOfRows={3} />;
		}
		return (
			<View style={[sharedStyles.card, styles.item]}>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Ngày:</Text>
					<Text style={[styles.rowText]}>{item.date}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Tiết:</Text>
					<Text style={[styles.rowText]}>{item.slot}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Giảng viên:</Text>
					<Text style={[styles.rowText]}>{item.lecturer}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Môt tả:</Text>
					<Text style={[styles.rowText]}>{item.description}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Trạng thái:</Text>
					<View
						style={[
							sharedStyles.tag,
							styles.tag,
							getAttendanceStyle(item.status),
						]}>
						<Text style={[styles.rowText]}>{item.status}</Text>
					</View>
				</View>
				<Text style={[styles.rowText, styles.label]}>Ghi chú:</Text>
				{!!item.note && (
					<Text style={[styles.rowText, styles.note]}>{item.note}</Text>
				)}
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

	const renderHeader = ({}) => {
		const terms = attendance.data || [];

		const currentTerm = _.find(attendance.data, {id: term?.id}) || {};
		const currentCourse = _.find(currentTerm.courses, (val) => {
			return val?.id === course?.id || (!val?.id && !course?.id);
		});
		const courses = currentTerm.courses || [];

		return (
			<View style={[sharedStyles.card, styles.header]}>
				<Dropdown
					data={terms}
					dropdownPosition={1}
					fontSize={18}
					labelExtractor={(item) => item.name}
					valueExtractor={(item) => item.name}
					value={term?.name}
					label="Chọn kỳ học:"
					onChangeText={(v, index) => {
						const newTerm = terms[index];
						setTerm(newTerm);
						setCourse(_.last(newTerm.courses || []));
					}}
					rippleInsets={{top: 16, right: 0, bottom: 0, left: 0}}
					renderBase={({title, label}) => (
						<View>
							<Text style={[styles.dropdownLabel]}>{label}</Text>
							<View style={sharedStyles.dropdownContentContainer}>
								<Text style={[styles.dropdownValue]}>{title}</Text>
								<Icon type="antdesign" name="down" size={18} color="#666" />
							</View>
							<View style={sharedStyles.dropdownDivider} />
						</View>
					)}
				/>
				<Dropdown
					data={courses}
					dropdownPosition={1}
					fontSize={18}
					labelExtractor={(item) => item.name}
					valueExtractor={(item) => item.name}
					value={currentCourse?.name}
					label="Chọn môn học:"
					onChangeText={(v, index) => {
						setCourse(courses[index]);
					}}
					renderBase={({title, label}) => (
						<View style={[styles.courseDropdown]}>
							<Text style={[styles.dropdownLabel]}>{label}</Text>
							<View style={sharedStyles.dropdownContentContainer}>
								<Text style={[styles.dropdownValue]}>{title}</Text>
								<Icon type="antdesign" name="down" size={18} color="#666" />
							</View>
							<View style={sharedStyles.dropdownDivider} />
						</View>
					)}
				/>
			</View>
		);
	};

	const renderSectionHeader = ({section: {title}}) => {
		if (!title) {
			return false;
		}
		const startOfWeek = moment(title, 'w');
		const nthOfMoth = Math.ceil(startOfWeek.date() / 7);
		const label = `Tuần ${nthOfMoth} / ${_.capitalize(
			startOfWeek.format('MMMM'),
		)} - (${startOfWeek.startOf('w').format('DD/MM')} - ${startOfWeek
			.endOf('w')
			.format('DD/MM')})`;
		const now = moment();
		let style = styles.passedHeader;
		if (now.isSame(startOfWeek, 'w')) {
			style = styles.activeHeader;
		} else if (now.isBefore(startOfWeek, 'w')) {
			style = styles.futureHeader;
		}
		return <Text style={[styles.sectionHeader, style]}>{label}</Text>;
	};

	return (
		<SafeAreaView style={styles.container}>
			<SectionList
				sections={data}
				keyExtractor={(item, index) => item.no + index}
				renderItem={renderItem}
				renderSectionFooter={renderNoContent}
				ListHeaderComponent={renderHeader}
				renderSectionHeader={renderSectionHeader}
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
	header: {
		marginTop: 10,
		marginBottom: 10,
	},
	courseDropdown: {
		marginTop: 16,
	},
	dropdownValue: {
		flex: 1,
		fontSize: 16,
	},
	dropdownLabel: {
		paddingHorizontal: 8,
		color: '#888',
		marginBottom: 6,
		fontSize: 13,
	},
	sectionHeader: {
		fontSize: 18,
		backgroundColor: '#ccc',
		paddingHorizontal: 16,
		paddingVertical: 6,
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
});

export default AttendancePage;
