import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value:   false,
}

export const drawerSlice = createSlice({

    name: 'drawerState',
    initialState,
    reducers: {
        setdrawerState: (state) => {
            state.value = !state.value
        },
        // setdrawerState: (state, action) => {
        //     state.value = action.payload;
        //   },
    },
})


export const { setdrawerState } = drawerSlice.actions

export default drawerSlice.reducer