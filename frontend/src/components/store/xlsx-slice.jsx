import { createSlice } from '@reduxjs/toolkit';


export const xlsxSlice = createSlice({

    name: 'xlsx',
    initialState: {
        bytes: {},
        name: ""
    },
    reducers: {
        setXlsx: (state, action) => {
            state.bytes = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        }
    },
    
});

export const { setXlsx, setName } = xlsxSlice.actions;
export default xlsxSlice.reducer;
