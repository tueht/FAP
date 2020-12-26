import React from 'react';
import {StyleSheet, Alert} from 'react-native';
import {Button} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {logout} from '../state/auth';
import locale from '../locale';

const HeaderLogoutButton = () => {
	const dispatch = useDispatch();
	const doLogout = () => {
		Alert.alert(locale.logout, locale.logoutQuestion, [
			{
				text: locale.cancel,
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => {
					dispatch(logout());
				},
			},
		]);
	};
	return (
		<Button
			type="clear"
			icon={{
				name: 'log-out',
				type: 'feather',
				size: 24,
				color: '#42a5f5',
			}}
			containerStyle={styles.buttonContainer}
			onPress={doLogout}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		padding: 12,
		borderRadius: 8,
	},
	buttonContainer: {
		// paddingRight: 16,
	},
	title: {
		textAlign: 'center',
		fontSize: 22,
	},
	divider: {
		marginVertical: 16,
	},
	about: {
		marginBottom: 24,
	},
});

export default HeaderLogoutButton;
