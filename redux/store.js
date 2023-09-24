import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
// import counterReducer from '../features/counter/counterSlice';
import counterReducer from './counterSlice';
import userReducer from './user/reducer'

const persistConfig = {
  key: 'root',
  storage,
}


const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
})


export const persistor = persistStore(store)