import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';

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
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  // SSE 연결 함수
  const connectSSE = () => {
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
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      withCredentials: true, // 토큰 값 전달을 위해 필요한 옵션
      // 타임아웃 설정 (기본값: 45000ms)
    }) as EventSourcePolyfill | NativeEventSource;

    eventSourceRef.current = eventSource;

    // 이벤트 수신 핸들러
    eventSource.onmessage = (event: SSEEvent) => {
      console.log('이벤트 수신 했어욤', event);

      const data = JSON.parse(event.data);
      toast.info(data.content, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    // 연결 상태 핸들러
    eventSource.onopen = () => {
      console.log('SSE 연결 성공');
      setIsConnected(true);

      // 연결 성공 시 재연결 타이머 초기화
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    eventSource.onerror = (error: SSEError) => {
      console.error('SSE 오류 발생', error);
      setIsConnected(false);

      // 연결 종료
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      // 재연결 시도 (지수 백오프 적용)
      //   const reconnectDelay = Math.min(
      //     1000 * Math.pow(2, reconnectAttempts),
      //     30000
      //   );
      //   console.log(`${reconnectDelay}ms 후 재연결 시도...`);

      //   reconnectTimeoutRef.current = window.setTimeout(() => {
      //     connectSSE();
      //   }, reconnectDelay);
      setTimeout(connectSSE, 3000);
    };
  };

  // 재연결 시도 횟수 추적
  //   const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    // 초기 연결
    connectSSE();

    // 컴포넌트 언마운트 시 연결 종료
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
    };
  }, [accessToken]); // 인증 상태와 토큰 변경을 감지 (원래: url, isAuthenticated, accessToken)

  return { eventSourceRef, isConnected };
};

export default useSSE;
