import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { EventSourcePolyfill } from 'event-source-polyfill';
import api from '@/apis/apiClient';

// EventSource 이벤트 타입 정의
interface SSEEvent extends Event {
  data: string;
}

// 반환 값 타입 정의
interface SSEHookReturn {
  isConnected: boolean;
  reconnect: () => void;
}

/**
 * SSE(Server-Sent Events) 연결을 관리하는 훅
 * @param url SSE 엔드포인트 URL
 * @returns 연결 상태와 재연결 함수
 */
const useSSE = (url: string): SSEHookReturn => {
  // EventSource 참조
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  
  // 현재 연결 상태
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // 인증 정보 가져오기
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  // 재연결 타이머 참조
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  // 핑 인터벌 참조
  const pingIntervalRef = useRef<number | null>(null);

  // 연결 시도 중인지 여부
  const isConnectingRef = useRef<boolean>(false);
  
  // 마지막 하트비트 시간
  const lastHeartbeatRef = useRef<number>(Date.now());

  // 핑 테스트 중지 함수
  const stopPingTest = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  // 재연결 타이머 중지 함수
  const stopReconnectTimer = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // 모든 리소스 정리 함수
  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('EventSource 연결 종료');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    stopPingTest();
    stopReconnectTimer();
    isConnectingRef.current = false;
    setIsConnected(false);
  }, [stopPingTest, stopReconnectTimer]);

  // 핑 테스트 시작 함수
  const startPingTest = useCallback(() => {
    // 기존 핑 테스트가 있다면 중지
    stopPingTest();

    // 15초마다 핑 테스트 실행
    pingIntervalRef.current = window.setInterval(async () => {
      try {
        // 30초 이상 하트비트가 없으면 연결이 끊어진 것으로 간주
        const timeSinceLastHeartbeat = Date.now() - lastHeartbeatRef.current;
        if (timeSinceLastHeartbeat > 30000) {
          console.warn('30초 이상 하트비트 없음, 연결 재설정');
          cleanup();
          connectSSE();
          return;
        }
        
        // 핑 요청 전송
        const response = await api.get('/notifications/ping');
        console.log('핑 테스트 성공:', response.status);
      } catch (error: any) {
        console.error('핑 테스트 실패:', error);

        // 410 에러(Gone)가 발생하면 연결이 비활성화된 것으로 간주
        if (error.response && error.response.status === 410) {
          console.log('연결이 비활성화됨. 재연결 시도...');
          cleanup();
          connectSSE();
        }
      }
    }, 17000);
  }, [cleanup]);

  // SSE 연결 함수
  const connectSSE = useCallback(() => {
    // 로그인 상태 확인
    if (!isAuthenticated || !accessToken) {
      console.log('로그인되지 않음, SSE 연결 불가');
      return;
    }

    // 이미 연결 중이거나 시도 중이면 중단
    if (eventSourceRef.current !== null || isConnectingRef.current) {
      console.log('이미 연결됨 또는 연결 시도 중');
      return;
    }

    isConnectingRef.current = true;
    console.log('SSE 연결 시도');

    try {
      // 캐시 방지를 위한 타임스탬프 추가
      const timestamp = Date.now();
      const connUrl = `${url}?t=${timestamp}`;
      
      // EventSource 생성
      const eventSource = new EventSourcePolyfill(connUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        },
        withCredentials: true,
        heartbeatTimeout: 60000, // 60초
      });
      
      eventSourceRef.current = eventSource;

      // 연결 성공 이벤트
      eventSource.onopen = () => {
        console.log('SSE 연결 성공');
        isConnectingRef.current = false;
        setIsConnected(true);
        lastHeartbeatRef.current = Date.now();
        
        // 연결 성공 시 핑 테스트 시작
        startPingTest();
      };

      // 연결 오류 이벤트
      eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        
        // 연결 정리
        cleanup();
        
        // 3초 후 재연결 시도
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('SSE 재연결 시도');
          connectSSE();
        }, 3000);
      };

      // 알림 이벤트 리스너
      eventSource.addEventListener('alarm', ((event: SSEEvent) => {
        console.log('알림 이벤트 수신:', event.data);
        lastHeartbeatRef.current = Date.now();
        
        try {
          const data = JSON.parse(event.data);
          // 데이터가 배열인 경우 각 항목에 대해 처리
          if (Array.isArray(data)) {
            data.forEach((item) => {
              if (item.content) {
                toast.info(item.content, {
                  position: 'bottom-right',
                  autoClose: 5000,
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
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } catch (error) {
          console.error('알림 데이터 파싱 오류:', error);
        }
      }) as EventListener);

      // 하트비트 이벤트 리스너
      eventSource.addEventListener('heartbeat', (() => {
        console.log('하트비트 수신');
        lastHeartbeatRef.current = Date.now();
      }) as EventListener);
      
      // 연결 이벤트 리스너
      eventSource.addEventListener('connect', ((event: SSEEvent) => {
        console.log('연결 이벤트 수신:', event.data);
        lastHeartbeatRef.current = Date.now();
      }) as EventListener);
      
      // 기타 이벤트 리스너들
      eventSource.addEventListener('unread', (() => {
        lastHeartbeatRef.current = Date.now();
      }) as EventListener);
      
      eventSource.addEventListener('recent-alarms', (() => {
        lastHeartbeatRef.current = Date.now();
      }) as EventListener);

    } catch (error) {
      console.error('SSE 연결 생성 중 오류:', error);
      isConnectingRef.current = false;
      
      // 오류 발생 시 3초 후 재시도
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connectSSE();
      }, 3000);
    }
  }, [isAuthenticated, accessToken, url, cleanup, startPingTest]);

  // 수동 재연결 함수
  const reconnect = useCallback(() => {
    console.log('SSE 수동 재연결 요청');
    cleanup();
    // 약간 지연 후 재연결
    reconnectTimeoutRef.current = window.setTimeout(() => {
      connectSSE();
    }, 500);
  }, [cleanup, connectSSE]);

  // 인증 상태나 액세스 토큰 변경 시
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connectSSE();
    } else {
      cleanup();
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      cleanup();
    };
  }, [isAuthenticated, accessToken, connectSSE, cleanup]);

  return { isConnected, reconnect };
};

export default useSSE;