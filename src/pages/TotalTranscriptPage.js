import React, {useEffect} from 'react';
import {View, SectionList, StyleSheet, SafeAreaView} from 'react-native';
import {Text} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';

import PageLoadingComponent from '../components/PageLoadingComponent';
import sharedStyles from '../styles';
import {fetchTotalTranscripts} from '../state/data';

const getStatusInfo = (status) => {
	if (status.includes('Passed')) {
		return {
			style: styles.passed,
			text: 'Đạt',
		};
	}
	if (status.includes('Studying')) {
		return {
			style: styles.studying,
			text: 'Đang học',
		};
	}
	return {
		style: styles.notStarted,
		text: 'Chưa bắt đầu',
	};
};

const TotalTranscriptPage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchTotalTranscripts());
	}, [dispatch]);

	const totalTranscripts =
		useSelector((state) => state.data.totalTranscripts) || {};

	if (totalTranscripts?.loading) {
		return <PageLoadingComponent numOfRows={3} />;
	}
	const data = [
		{
			data: totalTranscripts.data || [],
		},
	];

	const renderItem = ({item, section}) => {
		const statusInfo = getStatusInfo(item.status);
		return (
			<View style={[sharedStyles.card, styles.item]}>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Số:</Text>
					<Text style={[styles.rowText]}>{item.no}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Kỳ học số:</Text>
					<Text style={[styles.rowText]}>{item.term}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Kỳ học:</Text>
					<Text style={[styles.rowText]}>{item.semester}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Mã môn học:</Text>
					<Text style={[styles.rowText]}>{item.subjectCode}</Text>
				</View>
				{!!item.replacedSubject && (
					<View style={[styles.rowContainer]}>
						<Text style={[styles.rowText, styles.label]}>
							Môn học thay thế:
						</Text>
						<Text style={[styles.rowText]}>{item.replacedSubject}</Text>
					</View>
				)}
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Tên môn học:</Text>
					<Text style={[styles.rowText]}>{item.subject}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Số tín chỉ:</Text>
					<Text style={[styles.rowText, sharedStyles.bold]}>{item.credit}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Điểm:</Text>
					<Text style={[styles.rowText, sharedStyles.bold]}>{item.grade}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Trạng thái:</Text>
					<View style={[sharedStyles.tag, styles.tag, statusInfo.style]}>
						<Text style={[styles.rowText]}>{statusInfo.text}</Text>
					</View>
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

	const renderSectionHeader = ({section: {title}}) => {
		if (!title) {
			return false;
		}
		return <Text style={styles.header}>{title}</Text>;
	};

	return (
		<SafeAreaView style={styles.container}>
			<SectionList
				sections={data}
				keyExtractor={(item, index) => item.no + index}
				renderItem={renderItem}
				renderSectionFooter={renderNoContent}
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
	tag: {
		height: 30,
		borderRadius: 15,
		minWidth: 100,
	},
	passed: {
		backgroundColor: '#9ccc65',
	},
	studying: {
		backgroundColor: '#64b5f6',
	},
	notStarted: {
		backgroundColor: '#ccc',
	},
});

export default TotalTranscriptPage;
