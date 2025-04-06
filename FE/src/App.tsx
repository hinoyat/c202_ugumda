import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers/Router';
import { Provider } from 'react-redux';
import { store } from './stores/store';
import { useEffect } from 'react';
import useSSE from './hooks/useSSE';
import api from './apis/apiClient';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SSEProvider = () => {
  useSSE('/api/notifications/subscribe'); // SSE 연결은 인증된 사용자에게만 적용됨

  return null; // UI를 렌더링하지 않음
};

const handleClick = async () => {
  const response = await api.get('/notifications/ping');
  console.log('핑테스트', response);
};

// 뒤로가기 감지 및 새로고침을 위한 컴포넌트
const BackHandler = () => {
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SSEProvider />
        {/* <button
          onClick={handleClick}
          className="absolute top-20 left-20 text-white z-50 cursor-pointer">
          핑테스트
        </button> */}
        <BackHandler />
        <AppRouter />
      </BrowserRouter>
      <ToastContainer className="z-9999" />
    </Provider>
  );
}

export default App;
