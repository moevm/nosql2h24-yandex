import { createSlice } from '@reduxjs/toolkit';

export const logSlice = createSlice({
    name: 'log',
    initialState: {
        logs: {}
    },
    reducers: {
        setLogs: (state, action) => {
            state.logs = action.payload;
        }
    }
});

export const { setLogs } = logSlice.actions;
export default logSlice.reducer;
