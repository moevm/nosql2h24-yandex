import { configureStore } from '@reduxjs/toolkit';
import brokerReducer from './broker-slice.jsx';
import xlsxReducer from './xlsx-slice.jsx';
import  userReducer  from './user-slice.jsx';

export const store = configureStore({
    reducer: {
        broker: brokerReducer,
        xlsx: xlsxReducer,
        user: userReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});
