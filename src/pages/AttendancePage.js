import React, {useState, useMemo, useCallback} from 'react';
import {
	View,
	SectionList,
	StyleSheet,
	SafeAreaView,
	LayoutAnimation,
} from 'react-native';
import {Text, Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import Ripple from 'react-native-material-ripple';
import produce from 'immer';

import sharedStyles from '../styles';
import PageLoadingComponent from '../components/PageLoadingComponent';
import {fetchCoursesForSemester} from '../state/data';
import locale from '../locale';

const AttendancePage = ({navigation}) => {
	const dispatch = useDispatch();
	const [sectionOpened, setSectionOpened] = useState({});
	const semesters = useSelector((state) => state.data.semesters || {});

	const renderItem = ({item, section}) => {
		if (item.CourseID === 'loading') {
			return <PageLoadingComponent numOfRows={1} />;
		}
		return (
			<Ripple
				style={[sharedStyles.card, styles.item]}
				onPress={() => {
					navigation.push('ClassAttendancePage', {
						course: item,
						semester: section.name,
					});
				}}>
				<View style={[styles.rowContainer, {alignItems: 'flex-start'}]}>
					<Text style={[styles.rowText, styles.label]}>
						{locale.subjectName}:
					</Text>
					<Text
						style={[
							styles.rowText,
							{flex: 1, textAlign: 'right', paddingStart: 8},
						]}>
						{item.SubjectName}
					</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>
						{locale.classCode}:
					</Text>
					<Text style={[styles.rowText]}>{item.ClassName}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>
						{locale.startDate}:
					</Text>
					<Text style={[styles.rowText]}>{item.StartDate}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>{locale.endDate}:</Text>
					<Text style={[styles.rowText]}>{item.EndDate}</Text>
				</View>
			</Ripple>
		);
	};

	const renderNoContent = useCallback(
		({section}) => {
			if (section.data.length === 0 && sectionOpened[section.title]) {
				return (
					<View style={styles.emptySection}>
						<Text style={[styles.emptyText]}>
							{locale.noClassesSemesterMessage}
						</Text>
					</View>
				);
			}
			return sectionOpened[section.title] ? (
				<View style={sharedStyles.py} />
			) : (
				<View />
			);
		},
		[sectionOpened],
	);

	const toggleSection = useCallback(
		(section) => {
			const {title, courses = {loading: false, data: []}} = section;
			LayoutAnimation.easeInEaseOut();
			setSectionOpened(
				produce(sectionOpened, (draft) => {
					draft[title] = !draft[title];
				}),
			);
			if (!courses.loading && courses.data?.length === 0) {
				dispatch(
					fetchCoursesForSemester({
						semester: section.name,
					}),
				);
			}
		},
		[sectionOpened, dispatch],
	);

	const renderSectionHeader = useCallback(
		({section}) => {
			const {title} = section;
			return (
				<Ripple
					style={[styles.sectionHeader]}
					onPress={() => toggleSection(section)}>
					<Text style={[styles.sectionHeaderText]}>{title}</Text>
					<Icon
						containerStyle={{
							transform: [
								{
									rotate: sectionOpened[title] ? '90deg' : '0deg',
								},
							],
						}}
						type="entypo"
						name="chevron-right"
					/>
				</Ripple>
			);
		},
		[sectionOpened, toggleSection],
	);

	const sections = useMemo(() => {
		const semestersData = semesters.data || [];
		return semestersData.map((item) => {
			let data = [];
			if (sectionOpened[item.name]) {
				data = item.courses?.loading
					? [{CourseID: 'loading'}]
					: item.courses?.data || [];
			}
			return {
				...item,
				title: item.name,
				data,
			};
		});
	}, [semesters, sectionOpened]);

	return (
		<SafeAreaView style={styles.container}>
			<SectionList
				sections={sections}
				keyExtractor={(item, index) => item.CourseID + index}
				renderItem={renderItem}
				renderSectionFooter={renderNoContent}
				renderSectionHeader={renderSectionHeader}
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
	header: {
		marginTop: 10,
		marginBottom: 10,
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
});

export default AttendancePage;
