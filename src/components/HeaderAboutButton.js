import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text, Divider} from 'react-native-elements';
import Modal from 'react-native-modal';

import AboutComponent from './AboutComponent';

const HeaderAboutButton = () => {
	const [modalVisible, setModalVisible] = useState(false);

	const toggleModal = () => {
		setModalVisible(!modalVisible);
	};

	return (
		<>
			<Button
				type="clear"
				icon={{
					name: 'infocirlce',
					type: 'antdesign',
					size: 24,
					color: '#42a5f5',
				}}
				containerStyle={styles.buttonContainer}
				onPress={toggleModal}
			/>
			{modalVisible && (
				<Modal
					isVisible={modalVisible}
					onBackButtonPress={toggleModal}
					onBackdropPress={toggleModal}>
					<View style={[styles.container]}>
						<Text style={[styles.title]}>Thông tin</Text>
						<Divider style={styles.divider} />
						<AboutComponent style={styles.about} />
						<Button title="Đóng" onPress={toggleModal} />
					</View>
				</Modal>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		padding: 12,
		borderRadius: 8,
	},
	buttonContainer: {
		paddingRight: 16,
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

export default HeaderAboutButton;
