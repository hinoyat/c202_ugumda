import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers/Router';
import { Provider } from 'react-redux';
import { store } from './stores/store';
import { useEffect } from 'react';

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
        <BackHandler />
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
