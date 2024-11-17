import { configureStore } from '@reduxjs/toolkit';
import brokerReducer from './broker-slice.jsx';

export const store = configureStore({
    reducer: {
        broker: brokerReducer,
    },
});
