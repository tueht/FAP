import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Icon, Button} from 'react-native-elements';
import codePush from 'react-native-code-push';
import logError from '../utils/logError';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {hasError: false};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return {hasError: true};
	}

	componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		logError('JS Crash', String(error));
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<View style={[styles.container]}>
					<Icon
						name="ios-bug-outline"
						type="ionicon"
						size={100}
						color="#f47b00"
					/>
					<View style={styles.textContainer}>
						<Text style={[styles.title]}>Đã có lỗi xảy ra!</Text>
						<Text style={[styles.subtitle]}>
							Chúng tôi đã được thông báo về vấn đề này và sẽ sửa chữa sớm nhất
							có thể.
						</Text>
					</View>
					<Button
						title="Bật lại ứng dụng"
						onPress={() => codePush.restartApp()}
					/>
				</View>
			);
		}

		return this.props.children;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	title: {
		textAlign: 'center',
		fontSize: 20,
		color: '#222',
	},
	subtitle: {
		textAlign: 'center',
		fontSize: 17,
		color: '#555',
		marginTop: 12,
	},
	textContainer: {
		maxWidth: 330,
		paddingTop: 30,
		paddingBottom: 40,
	},
});

export default ErrorBoundary;
