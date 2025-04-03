import { MusicState } from '@/stores/music/music.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 로컬 스토리지에서 유저의 음악 설정을 불러옴
const getSavedMusicState = (): { isPlaying: boolean; volume: number } => {
  try {
    // 저장된 상태 확인
    const savedState = localStorage.getItem('musicSettings');
    if (savedState) {
      // 저장된 설정이 있으면 파싱하여 변환
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('음악 불러오기 실패ㅠㅠㅠㅠㅠ:', error);
  }
  // 저장된 설정이 없으면 기본값=음악 켜진상태
  return { isPlaying: true, volume: 0.5 };
};

// ------------------------------------------------------------------------------------

// 저장된 설정 불러오기
const { isPlaying, volume } = getSavedMusicState();

// 초기 상태 설정
const initialState: MusicState = {
  isPlaying, // 로컬 스토리지에서 불러온 재생 상태
  volume, // 로컬 스토리지에서 불러온 볼륨
  audioLoaded: false, // 오디오 로드 상태 초기값
  currentTrack: null, // 현재 트랙 초기값 (null)
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    // 음악 재생 상태 토글 (재생 <-> 일시정지)
    toggleMusic: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    // 음악 재생 상태 직접 설정
    // setIsPlaying: (state, action: PayloadAction<boolean>) => {
    //   state.isPlaying = action.payload;
    // },

    // 볼륨 설정
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    // 오디오 로드 상태 설정
    setAudioLoaded: (state, action: PayloadAction<boolean>) => {
      state.audioLoaded = action.payload;
    },
    // 현재 트랙 설정
    // setCurrentTrack: (state, action: PayloadAction<string | null>) => {
    //   state.currentTrack = action.payload;
    // },
  },
});

export const {
  toggleMusic,
  // setIsPlaying,
  setVolume,
  setAudioLoaded,
  // setCurrentTrack,
} = musicSlice.actions;

export default musicSlice.reducer;
