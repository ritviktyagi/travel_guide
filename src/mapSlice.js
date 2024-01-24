import { createSlice } from "@reduxjs/toolkit"

export const mapSlice = createSlice({
    name: 'map',
    initialState: {
        selectPositions: [],
        selectedPosition: {},
    },
    reducers: {
        getPositions: (state, action) => {
            state.selectPositions = action.payload;
            localStorage.setItem("selectPositions", JSON.stringify(state.selectPositions));
            // console.log(state.selectPositions, "selp")
        },

        getSelectedPosition: (state, action) => {
            // console.log(action.payload, "selpo")
            state.selectedPosition = action.payload;
            localStorage.setItem("selectedPosition", JSON.stringify(state.selectedPosition));
        }
    }
})

export const { getPositions, getSelectedPosition } = mapSlice.actions;
export default mapSlice.reducer;