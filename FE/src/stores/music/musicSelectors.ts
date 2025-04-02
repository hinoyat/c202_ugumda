import { RootState } from '@/stores/store';

// 음악이 현재 재생 중인지 여부 (true/false)
export const selectMusicPlaying = (state: RootState) => state.music.isPlaying;

// 음악 볼륨
export const selectMusicVolume = (state: RootState) => state.music.volume;

// 오디오 파일이 로드 되었는가
export const selectAudioLoaded = (state: RootState) => state.music.audioLoaded;

// 현재 음악의 파일 경로
export const selectCurrentTrack = (state: RootState) =>
  state.music.currentTrack;
