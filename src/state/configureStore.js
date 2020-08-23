import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import rootReducer from './reducers';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
	const store = configureStore({
		reducer: persistedReducer,
		middleware: getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
	});
	const persistor = persistStore(store);
	return {store, persistor};
};
