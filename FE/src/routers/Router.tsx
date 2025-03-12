import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../common/Layout'; // Layout 컴포넌트 import

const ErrorPage = lazy(() => import('../domains/error/ErrorPage'));
const MainPage = lazy(() => import('../domains/mainpage/pages/MainPage'));
const Login = lazy(() => import('../domains/login/pages/Login'));
const Signup = lazy(() => import('../domains/signup/pages/Signup'));
const SpaceShip = lazy(() => import('../domains/spaceship/pages/SpaceShip'));
const PasswordCheck = lazy(() => import('../domains/spaceship/pages/PasswordCheck'))
const LuckyNumber = lazy(
  () => import('../domains/luckyNumber/pages/LuckyNumber')
);
const TodayFortune = lazy(
  () => import('../domains/todayFortune/pages/TodayFortune')
);
const DreamSolve = lazy(() => import('../domains/dreamSolve/pages/DreamSolve'));

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Layout이 필요한 라우트 */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<MainPage />}
          />
          <Route
            path="/spaceship"
            element={<SpaceShip />}
          />
          <Route
            path="/luckynumber"
            element={<LuckyNumber />}
          />
          <Route
            path="/todayfortune"
            element={<TodayFortune />}
          />
          <Route
            path="/dreamsolve"
            element={<DreamSolve />}
          />
        </Route>
        {/* 로그인 및 회원가입은 Navbar 없이 */}
        <Route 
          path="/passwordcheck"
          element={<PasswordCheck/>}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="*"
          element={<ErrorPage />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
