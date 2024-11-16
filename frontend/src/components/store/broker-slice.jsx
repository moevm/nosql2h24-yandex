import { createSlice } from '@reduxjs/toolkit';

export const brokerSlice = createSlice({
    name: 'broker',
    initialState: {
        brokers: {}
    },
    reducers: {
        setBrokers: (state, action) => {
            console.log("SLICE - ", action.payload);
            state.brokers = action.payload;
        }
    }
});

export const { setBrokers } = brokerSlice.actions;
export default brokerSlice.reducer;
