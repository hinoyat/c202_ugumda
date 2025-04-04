import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers/Router';
import { Provider } from 'react-redux';
import { store } from './stores/store';
import useSSE from './hooks/useSSE';
import api from './apis/apiClient';

const SSEProvider = () => {
  useSSE('/api/notifications/subscribe'); // SSE 연결은 인증된 사용자에게만 적용됨

  return null; // UI를 렌더링하지 않음
};

const handleClick = async () => {
  const response = await api.get('/notifications/ping');
  console.log('핑테스트', response);
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <button
          onClick={handleClick}
          className="absolute top-20 left-20 text-white z-50 cursor-pointer">
          핑테스트
        </button>
        <AppRouter />
        <SSEProvider />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
