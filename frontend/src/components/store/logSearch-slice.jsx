import { createSlice } from '@reduxjs/toolkit';

export const logSearchSlice = createSlice({
    name: 'logSearch',
    initialState: {
        logSearchValues: []
    },
    reducers: {
        setLogSearchValues: (state, action) => {
            state.logSearchValues = action.payload;
        }
    }
});

export const { setLogSearchValues } = logSearchSlice.actions;
export default logSearchSlice.reducer;
