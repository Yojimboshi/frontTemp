import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
// import counterReducer from '../features/counter/counterSlice';
import counterReducer from './counterSlice';
import userReducer from './user/reducer'


const rootReducer = combineReducers({ 
  counter: counterReducer,
  user: userReducer
})
export const store = configureStore({
  reducer: rootReducer
})
