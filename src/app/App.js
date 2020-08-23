import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import codePush from 'react-native-code-push';

import {CODE_PUSH_DEPLOYMENT_KEY} from '@env';

import configureStore from '../state/configureStore';
import AppRouter from './AppRouter';

const {store, persistor} = configureStore();

const App = () => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AppRouter />
			</PersistGate>
		</Provider>
	);
};

const codePushOptions = {
	checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
	deploymentKey: CODE_PUSH_DEPLOYMENT_KEY,
};
export default codePush(codePushOptions)(App);
