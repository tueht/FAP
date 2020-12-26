import React from 'react';
import {StatusBar, NativeModules} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import codePush from 'react-native-code-push';

import {CODE_PUSH_DEPLOYMENT_KEY} from '@env';

import configureStore from '../state/configureStore';
import AppRouter from './AppRouter';
import ErrorBoundary from '../components/ErrorBoundary';

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
	UIManager.setLayoutAnimationEnabledExperimental(true);

const {store, persistor} = configureStore();

const App = () => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ErrorBoundary>
					<StatusBar barStyle="dark-content" />
					<AppRouter />
				</ErrorBoundary>
			</PersistGate>
		</Provider>
	);
};

const codePushOptions = {
	checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
	deploymentKey: CODE_PUSH_DEPLOYMENT_KEY,
};
export default codePush(codePushOptions)(App);
