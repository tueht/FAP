import React, {useEffect} from 'react';
import {View, SectionList, StyleSheet, SafeAreaView} from 'react-native';
import {Text} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';

import PageLoadingComponent from '../components/PageLoadingComponent';
import sharedStyles from '../styles';
import {fetchTuitionFee} from '../state/data';

const TuitionFeePage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchTuitionFee());
	}, [dispatch]);

	const tuitionFee = useSelector((state) => state.data.tuitionFee);

	if (tuitionFee.loading) {
		return <PageLoadingComponent numOfRows={3} />;
	}

	const data = [
		{
			data: tuitionFee.data || [],
		},
	];

	const renderItem = ({item, section}) => {
		return (
			<View style={[sharedStyles.card, styles.item]}>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Hoá đơn số:</Text>
					<Text style={[styles.rowText]}>{item.no}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Kỳ học:</Text>
					<Text style={[styles.rowText]}>{item.semester}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Ngày:</Text>
					<Text style={[styles.rowText]}>{item.invoiceDate}</Text>
				</View>
				<View style={[styles.rowContainer]}>
					<Text style={[styles.rowText, styles.label]}>Số tiền:</Text>
					<Text style={[styles.rowText]}>{item.amount}đ</Text>
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
});

export default TuitionFeePage;
