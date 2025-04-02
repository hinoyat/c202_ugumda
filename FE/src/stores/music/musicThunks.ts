import {
  setAudioLoaded,
  setCurrentTrack,
  setIsPlaying,
  setVolume,
  toggleMusic,
} from '@/stores/music/musicSlice';
import { AppDispatch, RootState } from '@/stores/store';

const audioInstance = new Audio();

// 음악 설정을 로컬 스토리지에 저장하는 함수
const saveMusicSettings = (isPlaying: boolean, volume: number): void => {
  try {
    localStorage.setItem(
      'musicSettings',
      JSON.stringify({ isPlaying, volume })
    );
  } catch (error) {
    console.error('음악 설정을 저장하는데 실패했습니다:', error);
  }
};

export const initializeAudio =
  (audioSrc: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // 🟢 오디오 소스 로깅
      console.log('🎵 오디오 소스:', audioSrc);
      console.log('🔍 현재 페이지 경로:', window.location.href);

      // 🟢 파일 존재 여부 로깅 (브라우저 환경에서)
      try {
        const response = await fetch(audioSrc);
        console.log('🌐 파일 페치 상태:', response.status);
        console.log(
          '🌐 파일 크기:',
          response.headers.get('content-length'),
          'bytes'
        );
      } catch (fetchError) {
        console.error('❌ 파일 페치 중 오류:', fetchError);
      }

      // 기존 오디오 정지
      audioInstance.pause();

      // 새 오디오 소스 설정
      audioInstance.src = audioSrc;
      audioInstance.loop = true; // 반복 재생 설정

      // 저장된 볼륨 설정 적용
      const state = getState().music;
      audioInstance.volume = state.volume;

      // 오디오 데이터 로드 시작
      audioInstance.load();

      // 트랙 및 로드 상태 업데이트
      dispatch(setCurrentTrack(audioSrc));
      dispatch(setAudioLoaded(true));

      // canplaythrough 이벤트: 오디오 충분히 로드되어 끊김 없이 재생 가능할 때
      audioInstance.addEventListener('canplaythrough', () => {
        console.log('오디오 로드 완료, 재생 준비됨');

        // 상태가 '재생 중'이면 자동으로 재생 시작
        if (state.isPlaying) {
          try {
            // 자동 재생 시도
            const playPromise = audioInstance.play();

            // play()는 Promise를 반환하며, 자동 재생 정책으로 실패할 수 있음
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.error('자동 재생 차단됨:', error);
                // 자동 재생 실패 시 상태 업데이트
                dispatch(setIsPlaying(false));
                saveMusicSettings(false, state.volume);
              });
            }
          } catch (error) {
            console.error('재생 시도 중 오류 발생:', error);
          }
        }
      });

      // 오류 발생 시 처리
      audioInstance.addEventListener('error', () => {
        console.error('오디오 로드 중 오류 발생');
        dispatch(setAudioLoaded(false));
      });

      return true;
    } catch (error) {
      console.error('오디오 초기화 실패:', error);
      dispatch(setAudioLoaded(false));
      return false;
    }
  };

// --------------------------음악 재생/일시정지 토글 함수--------------------------//

export const togglePlayback =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    // 리덕스 상태 토글 (재생 <-> 일시정지)
    dispatch(toggleMusic());

    // 토글 후의 상태 가져오기
    const state = getState();
    const willBePlaying = state.music.isPlaying;

    try {
      if (willBePlaying) {
        // 재생 명령
        const playPromise = audioInstance.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('재생 시도 중 오류:', error);
            // 실패 시 상태 다시 업데이트
            dispatch(setIsPlaying(false));
            saveMusicSettings(false, state.music.volume);
          });
        }
      } else {
        // 일시정지 명령
        audioInstance.pause();
      }

      // 변경된 설정 저장
      saveMusicSettings(willBePlaying, state.music.volume);
    } catch (error) {
      console.error('재생 상태 변경 중 오류 발생:', error);

      // 실제 오디오 상태와 리덕스 상태 동기화
      const actuallyPlaying = !audioInstance.paused;
      dispatch(setIsPlaying(actuallyPlaying));
      saveMusicSettings(actuallyPlaying, state.music.volume);
    }
  };

// --------------------- 볼륨 변경 함수 --------------------------- //
export const changeVolume =
  (volume: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // 오디오 볼륨 설정
      audioInstance.volume = volume;

      // 리덕스 상태 업데이트
      dispatch(setVolume(volume));

      // 변경된 설정 저장
      const state = getState();
      saveMusicSettings(state.music.isPlaying, volume);
    } catch (error) {
      console.error('볼륨 변경 중 오류 발생:', error);
    }
  };
