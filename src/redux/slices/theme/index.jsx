import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value:   false,
}

export const themeSlice = createSlice({

    name: 'darkTheme',
    initialState,
    reducers: {
        changeThemeMode: (state) => {
            state.value = !state.value
        },
        setDarkMode: (state, action) => {
            state.value = action.payload;
          },
          toggleDarkMode: (state) => {
            state.value = !state.value;
            localStorage.setItem('darkMode', state.value);
          },
    },
})


export const { changeThemeMode, setDarkMode, toggleDarkMode } = themeSlice.actions

export default themeSlice.reducer