import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchValues: []
    },
    reducers: {
        setSearchValues: (state, action) => {
            state.searchValues = action.payload;
        }
    }
});

export const { setSearchValues } = searchSlice.actions;
export default searchSlice.reducer;
