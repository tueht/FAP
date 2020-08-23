import React from 'react';
import {View, StyleSheet} from 'react-native';
import Autolink from 'react-native-autolink';
import {about} from '../constants';

const AboutComponent = ({style}) => {
	return (
		<View style={style}>
			{about.map((paragraph, idx) => (
				<Autolink style={styles.p} key={`p-${idx}`} text={paragraph} />
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	p: {
		color: '#666',
		marginBottom: 8,
	},
});

export default AboutComponent;
