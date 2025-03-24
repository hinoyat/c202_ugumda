import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers/Router';
import { Provider } from 'react-redux';
import { store } from './stores/store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
