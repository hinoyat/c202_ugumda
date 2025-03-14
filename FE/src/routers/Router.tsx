import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../common/Layout'; // Layout 컴포넌트 import
import OtherMainPage from '@/domains/mainpage/pages/OtherMainPage';

const ErrorPage = lazy(() => import('../domains/error/ErrorPage'));
const MainPage = lazy(() => import('../domains/mainpage/pages/MainPage'));
const Login = lazy(() => import('../domains/login/pages/Login'));
const Signup = lazy(() => import('../domains/signup/pages/Signup'));
const GuestBook = lazy(() => import('../domains/guestbook/GuestBook'));
const DiaryDetail = lazy(() => import('../domains/diary/modals/DiaryDetail'));
const SpaceShip = lazy(() => import('../domains/spaceship/pages/SpaceShip'));
const PasswordCheck = lazy(
  () => import('../domains/spaceship/pages/PasswordCheck')
);
const MyInformation = lazy(
  () => import('../domains/myinformation/pages/MyInformation')
);
const SuccessfulEdit = lazy(
  () => import('../domains/myinformation/pages/SuccessfulEdit')
);
const FailEdit = lazy(() => import('../domains/myinformation/pages/FailEdit'));
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
            path="/othermain"
            element={<OtherMainPage />}
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
          <Route
            path="/test"
            element={<GuestBook />}
          />
          <Route
            path="/test2"
            element={<DiaryDetail />}
          />
        </Route>
        {/* 로그인 및 회원가입은 Navbar 없이 */}
        <Route
          path="/myinformation"
          element={<MyInformation />}
        />

        <Route
          path="/passwordcheck"
          element={<PasswordCheck />}
        />
        <Route
          path="/successedit"
          element={<SuccessfulEdit />}
        />
        <Route
          path="/failedit"
          element={<FailEdit />}
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
