import React, {useEffect} from 'react';
import {View, SectionList, StyleSheet, SafeAreaView} from 'react-native';
import {Text} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import PageLoadingComponent from '../components/PageLoadingComponent';
import sharedStyles from '../styles';
import {fetchSchedule} from '../state/data';

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
const SchedulePage = () => {
	const dispatch = useDispatch();
	const schedule = useSelector((state) => state.data.schedule) || {};

	const scheduleData = schedule[schedule.activeWeek] || [];
	useEffect(() => {
		dispatch(fetchSchedule());
	}, [dispatch]);

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
});

export default SchedulePage;
