import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
	card: {
		shadowColor: '#444',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.18,
		shadowRadius: 2,

		elevation: 3,

		backgroundColor: 'white',
		borderRadius: 4,

		marginHorizontal: 10,
		paddingHorizontal: 10,
		paddingVertical: 12,
	},
	tag: {
		height: 34,
		borderRadius: 17,
		borderColor: '#ccc',
		borderWidth: StyleSheet.hairlineWidth,
		paddingHorizontal: 14,
		justifyContent: 'center',
		alignItems: 'center',
	},
	bold: {
		fontWeight: 'bold',
	},
	dropdownDivider: {
		borderBottomColor: '#bbb',
		marginHorizontal: 8,
		borderBottomWidth: 1,
	},
	dropdownContentContainer: {
		flexDirection: 'row',
		marginHorizontal: 8,
		marginBottom: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	px: {paddingHorizontal: 8},
	py: {paddingVertical: 8},
	px2: {paddingHorizontal: 16},
	py2: {paddingVertical: 16},
	px3: {paddingHorizontal: 24},
	py3: {paddingVertical: 24},
});

export default styles;
