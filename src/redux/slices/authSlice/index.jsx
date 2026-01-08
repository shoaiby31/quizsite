import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uid: null,
  email: null,
  displayName: null,
  photoURL: null,
  isAuthenticated: false,
  role: null,
  userReady: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setUser(state, action) {
    //   const { uid, email, displayName, photoURL, role } = action.payload;
    //   state.uid = uid;
    //   state.email = email;
    //   state.displayName = displayName;
    //   state.photoURL = photoURL;
    //   state.role = role;
    //   state.isAuthenticated = true;
    // }
    setUser(state, action) {
      const payload = action.payload;

      if (!payload) {
        // Don't do anything if payload is null (or clear if desired)
        return;
      }

      const { uid, email, displayName, photoURL, role } = payload;
      state.uid = uid;
      state.email = email;
      state.displayName = displayName;
      state.photoURL = photoURL;
      state.role = role;
      state.isAuthenticated = true;
    },
    setUserReadyState: (state, action) => {
      Object.assign(state, action.payload);
      state.userReady = true;
    },
    changeUserRole: (state) => {
      state.role = state.role === 'student' ? 'admin' : 'student'
    },
    clearUser(state) {
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoURL = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser, changeUserRole } = authSlice.actions;
export default authSlice.reducer;