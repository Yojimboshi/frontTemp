import { combineReducers } from '@reduxjs/toolkit'
import { PersistConfig, persistReducer } from 'redux-persist'
import user from './user/reducer'
import localForage from 'localforage'
import counterReducer from './counterSlice';
const persistedReducers = {
    user,
}

const appReducer = combineReducers({
    counterReducer,
    ...persistedReducers,
})

export type AppState = ReturnType<typeof appReducer>

const persistConfig: PersistConfig<AppState> = {
    key: 'interface',
    version: 0, // see migrations.ts for more details about this version
    storage: localForage.createInstance({
        name: 'redux',
    }),
    whitelist: Object.keys(persistedReducers),
    throttle: 1000, // ms
    serialize: false,
    // The typescript definitions are wrong - we need this to be false for unserialized storage to work.
    // We need unserialized storage for inspectable db entries for debugging.
    // @ts-ignore
    deserialize: false,
}

const persistedReducer = persistReducer(persistConfig, appReducer)

export default persistedReducer