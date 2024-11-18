import { configureStore } from '@reduxjs/toolkit';
import brokerReducer from './broker-slice.jsx';
import xlsxReducer from './xlsx-slice.jsx'

export const store = configureStore({
    reducer: {
        broker: brokerReducer,
        xlsx: xlsxReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});
