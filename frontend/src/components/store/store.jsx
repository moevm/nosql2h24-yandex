import { configureStore } from '@reduxjs/toolkit';
import brokerReducer from './broker-slice.jsx';
import xlsxReducer from './xlsx-slice.jsx';
import  userReducer  from './user-slice.jsx';
import logReducer from './log-slice.jsx'
import searchReducer from './search-slice.jsx'
import logSearchReducer from './logSearch-slice.jsx';

export const store = configureStore({
    reducer: {
        broker: brokerReducer,
        xlsx: xlsxReducer,
        user: userReducer,
        log: logReducer,
        search: searchReducer,
        logSearch: logSearchReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});
