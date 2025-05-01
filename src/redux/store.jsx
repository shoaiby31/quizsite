import { configureStore } from '@reduxjs/toolkit'
import themeSlice from './slices/theme'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    mode: themeSlice,
    auth: authReducer,
  },
});

