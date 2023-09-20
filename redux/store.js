import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { persistStore } from 'redux-persist'

import reducer from './reducer';

export function createDefaultStore(){
	return configureStore({
		reducer,
	})
}

const store = createDefaultStore();
export const persistor = persistStore(store)

setupListeners(store.dispatch)

store.dispatch(updateVersion())
export default store
