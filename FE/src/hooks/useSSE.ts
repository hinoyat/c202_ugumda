import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import api from '@/apis/apiClient';

// EventSource 이벤트 타입 정의
interface SSEEvent extends Event {
  data: string;
}

// EventSource 에러 타입 정의
interface SSEError extends Event {
  error?: Error;
}

const useSSE = (url: string) => {
  const eventSourceRef = useRef<EventSourcePolyfill | NativeEventSource | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const pingIntervalRef = useRef<number | null>(null);
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  // SSE 연결 함수
  const connectSSE = useCallback(() => {
    if (!isAuthenticated || !accessToken) {
      console.log('sse훅 : 로그인 안 되어있네염 리턴 빠빠이');
      return;
    }

    // 기존 연결이 있으면 닫기
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    console.log('SSE 연결 시도 중...');

    // SSE 연결 생성
    const EventSource = EventSourcePolyfill || NativeEventSource;
    const eventSource = new EventSource(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true, // 토큰 값 전달을 위해 필요한 옵션
    }) as EventSourcePolyfill | NativeEventSource;

    eventSourceRef.current = eventSource;

    // 이벤트 수신 핸들러
    eventSource.addEventListener('alarm', ((event: SSEEvent) => {
      console.log('알림 이벤트 수신:', event);

      try {
        const data = JSON.parse(event.data);
        // 데이터가 배열인 경우 각 항목에 대해 처리
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.content) {
              toast.info(item.content, {
                position: 'bottom-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            }
          });
        }
        // 단일 객체인 경우
        else if (data && data.content) {
          toast.info(data.content, {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error('데이터 파싱 오류:', error);
      }
    }) as EventListener);

    // 연결 상태 핸들러
    eventSource.onopen = () => {
      console.log('SSE 연결 성공');
      setIsConnected(true);

      // 연결 성공 시 재연결 타이머 초기화
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // 연결 성공 시 핑 테스트 시작
      startPingTest();
    };

    eventSource.onerror = (error: SSEError) => {
      console.error('SSE 오류 발생', error);
      setIsConnected(false);

      // 연결 종료
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      // 핑 테스트 중지
      stopPingTest();

      // 재연결 시도
      setTimeout(connectSSE, 3000);
    };
  }, [isAuthenticated, accessToken, url]);

  // 핑 테스트 시작 함수
  const startPingTest = useCallback(() => {
    // 기존 핑 테스트가 있다면 중지
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }

    // 3초마다 핑 테스트 실행
    pingIntervalRef.current = window.setInterval(async () => {
      try {
        await api.get('/notifications/ping');
        console.log('핑 테스트 성공');
      } catch (error: any) {
        console.error('핑 테스트 실패:', error);

        // 410 에러(Gone)가 발생하면 연결이 비활성화된 것으로 간주
        if (error.response && error.response.status === 410) {
          console.log('SSE 연결이 비활성화되었습니다. 재연결 시도...');

          // 기존 연결 종료
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }

          // 핑 테스트 중지
          stopPingTest();

          // SSE 연결 재시도
          connectSSE();
        }
      }
    }, 3000);
  }, [connectSSE]);

  // 핑 테스트 중지 함수
  const stopPingTest = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    // 초기 연결
    connectSSE();

    // 컴포넌트 언마운트 시 연결 종료 및 핑 테스트 중지
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        console.log('컴포넌트 언마운트시 SSE 연결 종료');
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      stopPingTest();
    };
  }, [accessToken, connectSSE, stopPingTest]);

  // SSE 연결 수동 재설정 함수 (외부에서 호출 가능)
  // const resetConnection = useCallback(() => {
  //   console.log('SSE 연결 수동 재설정');

  //   // 기존 연결 종료
  //   if (eventSourceRef.current) {
  //     eventSourceRef.current.close();
  //     eventSourceRef.current = null;
  //   }

  //   // 핑 테스트 중지
  //   stopPingTest();

  //   // 새로운 연결 시도
  //   connectSSE();
  // }, [connectSSE, stopPingTest]);

  return { eventSourceRef, isConnected };
};

export default useSSE;
