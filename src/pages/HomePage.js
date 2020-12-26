import React, {useEffect, useLayoutEffect} from 'react';
import {View, SectionList, StyleSheet} from 'react-native';
import {Text, Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import Ripple from 'react-native-material-ripple';
import moment from 'moment';

import {fetchSemesters, fetchNews, fetchSubjects} from '../state/data';
import {logout} from '../state/auth';
import sharedStyles from '../styles';
import HeaderAboutButton from '../components/HeaderAboutButton';
import HeaderLogoutButton from '../components/HeaderLogoutButton';

import locale from '../locale';

const HomePage = ({navigation}) => {
	const dispatch = useDispatch();
	const studentInfo = useSelector((state) => state.auth);
	const {news} = useSelector((state) => state.data);

	useEffect(() => {
		dispatch(fetchNews());
		dispatch(fetchSemesters());
		dispatch(fetchSubjects());
	}, [dispatch]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => <HeaderAboutButton />,
			headerRight: () => <HeaderLogoutButton />,
		});
	}, [navigation]);

	const data = [
		{
			type: 'profile',
			data: [
				{
					type: 'profile',
					data: studentInfo,
				},
			],
		},
		{
			type: 'button',
			title: locale.info,
			data: [
				{
					type: 'Schedule',
					label: locale.weeklySchedule,
					icon: {
						name: 'timetable',
						type: 'material-community',
						color: '#43a047',
						reverse: true,
					},
				},
				{
					type: 'Attendance',
					label: locale.attendances,
					icon: {
						name: 'table-check',
						type: 'material-community',
						reverse: true,
						color: '#1976d2',
					},
				},
				// {type: 'Transcript', label: 'Điểm chi tiết từng môn'},
				{
					type: 'SemesterGrades',
					label: locale.semesterGrades,
					icon: {
						name: 'table-account',
						type: 'material-community',
						reverse: true,
						color: '#d84315',
					},
				},
				{
					type: 'TuitionFee',
					label: locale.tuitionFee,
					icon: {
						name: 'money',
						type: 'font-awesome',
						reverse: true,
						color: '#5e35b1',
					},
				},
			],
		},
		{
			title: locale.news,
			type: 'news',
			data: news,
		},
	];

	const renderProfileRow = (profile) => {
		return (
			<View style={[sharedStyles.card, styles.profileContainer, styles.row]}>
				<View style={styles.profileRow}>
					<Text style={[styles.profile]}>{locale.studentName}:</Text>
					<Text style={[styles.profile]}>{profile.studentName}</Text>
				</View>
				<View style={styles.profileRow}>
					<Text style={[styles.profile]}>{locale.studentNumber}:</Text>
					<Text style={[styles.profile]}>{profile.studentNo}</Text>
				</View>
			</View>
		);
	};

	const renderButton = (item) => {
		return (
			<Ripple
				style={[sharedStyles.card, styles.row, styles.buttonContainer]}
				rippleContainerBorderRadius={4}
				onPress={() => navigation.push(item.type)}>
				<Icon
					name="timetable"
					type="material-community"
					size={30}
					{...item.icon}
				/>
				<Text style={[styles.buttonText]}>{item.label}</Text>
				<Icon name="right" type="antdesign" color="#888" size={20} />
			</Ripple>
		);
	};

	const renderItem = ({item, section}) => {
		if (section.type === 'profile') {
			return renderProfileRow(item.data);
		}
		if (section.type === 'button') {
			return renderButton(item);
		}
		return renderNew(item);
	};

	const renderNew = (item) => {
		const Component = item.id ? Ripple : View;
		return (
			<Component
				onPress={() =>
					navigation.push('New', {
						newItem: item,
					})
				}
				style={[sharedStyles.card, styles.row]}
				rippleContainerBorderRadius={4}>
				<Text style={[item.isSpecial ? styles.specialNew : styles.newText]}>
					{item.title}
				</Text>
				{!!item.createdAt && (
					<Text style={[styles.newTime]}>
						{moment(item.createdAt).fromNow()}
					</Text>
				)}
			</Component>
		);
	};

	const renderSectionHeader = ({section: {title}}) => {
		if (!title) {
			return false;
		}
		return <Text style={styles.header}>{title}</Text>;
	};

	const renderNoContent = ({section}) => {
		return <View style={styles.row} />;
	};

	return (
		<SectionList
			sections={data}
			keyExtractor={(item, index) =>
				(item.id || item.label || item.title) + index
			}
			renderItem={renderItem}
			renderSectionHeader={renderSectionHeader}
			renderSectionFooter={renderNoContent}
			showsVerticalScrollIndicator={false}
		/>
	);
};

const styles = StyleSheet.create({
	row: {
		marginTop: 12,
	},
	profileContainer: {
		paddingHorizontal: 12,
	},
	profile: {
		fontSize: 19,
		lineHeight: 28,
		color: '#222',
	},
	profileRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	item: {
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
	},
	header: {
		fontSize: 18,
		paddingHorizontal: 16,
		backgroundColor: '#aed581',
		paddingVertical: 6,
	},
	buttonContainer: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		flexDirection: 'row',
		alignItems: 'center',
	},
	buttonText: {
		flex: 1,
		marginHorizontal: 8,
		fontSize: 17,
	},
	newText: {
		fontSize: 16,
	},
	specialNew: {
		fontSize: 16,
		color: '#43a047',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	newTime: {
		marginTop: 4,
		color: '#666',
		fontSize: 14,
	},
});

export default HomePage;
