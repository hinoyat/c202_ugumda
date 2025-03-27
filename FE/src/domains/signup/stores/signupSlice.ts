import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  password: '',
  nickname: '',
  iconSeq: 0,
  birthDate: '',
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default signupSlice.reducer;
