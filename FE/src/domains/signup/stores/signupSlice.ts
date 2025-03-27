import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SignupState } from './signupTypes';
import { checkUsername, checkNickname, signupUser } from './signupThunks';

const initialState: SignupState = {
  username: '',
  usernameStatus: 'invalid',
  usernameMessage: '아이디를 입력하세요.',
  nickname: '',
  nicknameStatus: 'invalid',
  nicknameMessage: '닉네임을 입력하세요.',
  password: '',
  confirmPassword: '',
  passwordMessage: '비밀번호를 입력하세요.',
  iconSeq: 0,
  birthDate: '',
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      // 유효성 검사
      if (!action.payload) {
        state.usernameMessage = '아이디를 입력하세요.';
        state.usernameStatus = 'invalid';
      } else if (!/^[a-zA-Z]{5,12}$/.test(action.payload)) {
        state.usernameMessage = '아이디는 5자에서 12자 사이로 입력해주세요.';
        state.usernameStatus = 'invalid';
      } else {
        state.usernameMessage = '중복 확인을 해주세요.';
        state.usernameStatus = 'idle';
      }
    },
    setNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
      if (!action.payload) {
        state.nicknameMessage = '닉네임을 입력하세요.';
        state.nicknameStatus = 'invalid';
      } else if (2 > action.payload.length || action.payload.length > 10) {
        state.nicknameMessage = '닉네임은 2자에서 10자 사이로 입력해주세요.';
        state.nicknameStatus = 'invalid';
      } else {
        state.nicknameMessage = '중복 확인을 해주세요.';
        state.nicknameStatus = 'idle';
      }
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      if (!action.payload) {
        state.passwordMessage = '비밀번호를 입력하세요.';
      } else if (
        !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
          action.payload
        )
      ) {
        state.passwordMessage =
          '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.';
      } else {
        state.passwordMessage = '사용 가능한 비밀번호 입니다.';
      }
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
      if (action.payload && action.payload === state.password) {
        state.passwordMessage = '비밀번호가 일치합니다.';
      }
    },
    setIconSeq: (state, action: PayloadAction<number>) => {
      state.iconSeq = action.payload;
    },
    setBirthDate: (state, action: PayloadAction<string>) => {
      state.birthDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUsername.pending, (state) => {
        state.usernameStatus = 'checking';
      })
      .addCase(checkUsername.fulfilled, (state, action) => {
        if (action.payload === '이미 사용 중인 아이디입니다.') {
          state.usernameStatus = 'invalid';
          state.usernameMessage = '이미 사용 중인 아이디입니다.';
          state.username = '';
        } else {
          state.usernameStatus = 'available';
          state.usernameMessage = '사용 가능한 아이디 입니다.';
        }
      })
      .addCase(checkUsername.rejected, (state) => {
        state.usernameStatus = 'unavailable';
        state.usernameMessage = '다시 시도해 주세요.';
      })
      .addCase(checkNickname.pending, (state) => {
        state.nicknameStatus = 'checking';
      })
      .addCase(checkNickname.fulfilled, (state, action) => {
        console.log(action.payload);
        if (action.payload === '이미 사용 중인 닉네임입니다.') {
          state.nicknameStatus = 'invalid';
          state.nicknameMessage = '이미 사용 중인 닉네임입니다.';
          state.nickname = '';
        } else {
          state.nicknameStatus = 'available';
          state.nicknameMessage = '사용 가능한 닉네임 입니다.';
        }
      })
      .addCase(checkNickname.rejected, (state) => {
        state.nicknameStatus = 'unavailable';
        state.nicknameMessage = '다시 시도해 주세요.';
      });
  },
});

export const {
  setUsername,
  setNickname,
  setPassword,
  setConfirmPassword,
  setIconSeq,
  setBirthDate,
} = signupSlice.actions;
export default signupSlice.reducer;
