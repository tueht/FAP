import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import sharedStyles from '../styles';

const LoadingRow = () => {
	return (
		<View style={[sharedStyles.card, styles.container]}>
			<SkeletonPlaceholder backgroundColor="#EAEAEE">
				<SkeletonPlaceholder.Item width={'60%'} height={16} borderRadius={4} />
				<SkeletonPlaceholder.Item
					width={'80%'}
					marginTop={8}
					height={16}
					borderRadius={4}
				/>
				<SkeletonPlaceholder.Item
					width={'95%'}
					marginTop={8}
					height={16}
					borderRadius={4}
				/>
				<SkeletonPlaceholder.Item
					marginTop={8}
					width={'30%'}
					height={16}
					borderRadius={4}
				/>
			</SkeletonPlaceholder>
		</View>
	);
};

const PageLoadingComponent = ({numOfRows = 1}) => {
	if (numOfRows < 1) {
		return false;
	}
	return (
		<>
			{Array(numOfRows)
				.fill(0)
				.map((__, idx) => (
					<LoadingRow key={`${idx}`} />
				))}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		marginTop: 12,
	},
});

export {LoadingRow};

export default PageLoadingComponent;
