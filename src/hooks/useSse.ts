import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from './redux';

interface SseOptions {
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useSse = (bookId: number | null, options: SseOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const token = useAppSelector(state => state.auth.accessToken);
  
  const {
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options;
  
  useEffect(() => {
    if (!bookId || !token) {
      return;
    }
    
    const connect = () => {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const url = `${baseUrl}/api/v2/sse/subscribe/${bookId}`;
      
      // EventSource는 헤더를 직접 설정할 수 없으므로 URL 파라미터로 토큰 전달
      // 서버에서 Bearer 토큰 헤더와 URL 파라미터 둘 다 지원하도록 수정 필요
      const eventSource = new EventSource(url, {
        withCredentials: true
      });
      
      // 연결 직후 토큰 전송을 위한 POST 요청 (선택사항)
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/event-stream'
        },
        credentials: 'include'
      }).catch(console.error);
      
      eventSource.onopen = () => {
        console.log('SSE 연결 성공');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        onOpen?.();
      };
      
      eventSource.onmessage = (event) => {
        console.log('SSE 메시지 수신:', event.data);
        setLastEventId(event.lastEventId);
        onMessage?.(event);
      };
      
      // 특정 이벤트 타입별 리스너
      eventSource.addEventListener('connected', (event: any) => {
        console.log('연결 확인:', event.data);
      });
      
      eventSource.addEventListener('LEDGER_CREATED', (event: any) => {
        const data = JSON.parse(event.data);
        console.log('새 거래 생성:', data);
        // Redux 액션 디스패치 등
      });
      
      eventSource.addEventListener('LEDGER_UPDATED', (event: any) => {
        const data = JSON.parse(event.data);
        console.log('거래 수정:', data);
      });
      
      eventSource.addEventListener('LEDGER_DELETED', (event: any) => {
        const data = JSON.parse(event.data);
        console.log('거래 삭제:', data);
      });
      
      eventSource.addEventListener('heartbeat', () => {
        console.log('하트비트');
      });
      
      eventSource.onerror = (error) => {
        console.error('SSE 오류:', error);
        setIsConnected(false);
        onError?.(error);
        
        // 재연결 로직
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`재연결 시도 ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval * reconnectAttemptsRef.current);
        } else {
          console.error('최대 재연결 시도 횟수 초과');
          onClose?.();
        }
      };
      
      eventSourceRef.current = eventSource;
    };
    
    connect();
    
    // 클린업
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsConnected(false);
        onClose?.();
      }
    };
  }, [bookId, token]);
  
  const sendUpdate = async (type: string, data: any) => {
    if (!bookId || !token) {
      throw new Error('Book ID 또는 토큰이 없습니다');
    }
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    
    // SSE는 단방향이므로 업데이트는 REST API로 전송
    const response = await fetch(`${baseUrl}/api/v2/book/${bookId}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type,
        data,
        timestamp: Date.now()
      })
    });
    
    if (!response.ok) {
      throw new Error(`업데이트 실패: ${response.statusText}`);
    }
    
    return response.json();
  };
  
  return {
    isConnected,
    lastEventId,
    sendUpdate
  };
}; 