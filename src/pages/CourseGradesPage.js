import React, {useEffect, useState} from 'react';
import {View, SectionList, StyleSheet, SafeAreaView} from 'react-native';
import {Text} from 'react-native-elements';
import {useDispatch} from 'react-redux';

import sharedStyles from '../styles';
import PageLoadingComponent from '../components/PageLoadingComponent';
import {fetchCourseGrades} from '../state/data';
import locale from '../locale';

const CourseGradesPage = ({route}) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [grades, setGrades] = useState([]);

	const {course, semester} = route.params;
	useEffect(() => {
		setLoading(true);
		dispatch(
			fetchCourseGrades({
				CourseId: course.CourseID,
			}),
		)
			.then((action) => {
				setGrades(action.payload);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [course, semester, dispatch]);

	const renderItem = ({item, section}) => {
		if (item === 'loading') {
			return <PageLoadingComponent numOfRows={3} />;
		}
		return (
			<View
				style={[
					sharedStyles.card,
					styles.item,
					item.isTotal && styles.totalRow,
				]}>
				{!item.isTotal && (
					<View style={[styles.rowContainer]}>
						<Text style={[styles.rowText, styles.label]}>
							{locale.subjectItem}:
						</Text>
						<Text style={[styles.rowText]}>{item.name}</Text>
					</View>
				)}
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>
						{item.isTotal ? locale.total : locale.weight}:
					</Text>
					<Text style={[styles.rowText]}>{item.weight}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>{locale.grade}:</Text>
					<Text style={[styles.rowText]}>{item.grade}</Text>
				</View>

				{!!item.comment && (
					<>
						<Text style={[styles.rowText, styles.label]}>{locale.note}:</Text>
						<Text style={[styles.rowText, styles.note]}>{item.comment}</Text>
					</>
				)}
			</View>
		);
	};

	const sections = loading
		? [
				{
					data: ['loading'],
				},
		  ]
		: grades;
	return (
		<SafeAreaView style={styles.container}>
			<View style={[sharedStyles.card, {marginVertical: 8}]}>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText]}>{locale.subjectName}:</Text>
					<Text style={[styles.rowText]}>{course.SubjectCode}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText]}>{locale.semester}:</Text>
					<Text style={[styles.rowText]}>{semester}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText]}>{locale.averageGrade}:</Text>
					<Text style={[styles.rowText]}>{course.AverageMark}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText]}>{locale.status}:</Text>
					<Text style={[styles.rowText]}>{course.Status}</Text>
				</View>
			</View>
			<SectionList
				sections={sections}
				keyExtractor={(item, index) => `${item.name}-${index}`}
				renderItem={renderItem}
				renderSectionHeader={({section: {title}}) => (
					<Text style={styles.header}>{title}</Text>
				)}
				renderSectionFooter={() => <View style={{height: 16}} />}
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

	totalRow: {
		backgroundColor: '#aed58166',
	},
});
export default CourseGradesPage;
