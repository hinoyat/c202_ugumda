import { RootState } from '@/stores/store';

export const selectUsername = (state: RootState) => state.signup.username;

export const selectUsernameMessage = (state: RootState) =>
  state.signup.usernameMessage;

export const selectUsernameStatus = (state: RootState) =>
  state.signup.usernameStatus;

export const selectNickname = (state: RootState) => state.signup.nickname;

export const selectNicknameMessage = (state: RootState) =>
  state.signup.nicknameMessage;

export const selectNicknameStatus = (state: RootState) =>
  state.signup.nicknameStatus;

export const selectPasswordMessage = (state: RootState) =>
  state.signup.passwordMessage;

export const selectIconSeq = (state: RootState) => state.signup.iconSeq;
