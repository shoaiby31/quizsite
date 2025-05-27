import { configureStore } from '@reduxjs/toolkit'
import themeSlice from './slices/theme'
import authReducer from './slices/authSlice'
import drawerReducer from './slices/drawerSlice'


export const store = configureStore({
  reducer: {
    mode: themeSlice,
    auth: authReducer,
    drawer:drawerReducer
  },
});

