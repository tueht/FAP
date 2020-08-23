import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

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

export default App;
