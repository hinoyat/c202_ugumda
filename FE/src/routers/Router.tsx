import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const ErrorPage = lazy(() => import("../domains/error/ErrorPage"))
const MainPage = lazy(() => import ("../domains/mainpage/pages/MainPage"));
const Login = lazy(() => import('../domains/login/pages/Login'));
const Signup =lazy(() => import('../domains/signup/pages/Signup'));
const SpaceShip = lazy(() => import('../domains/spaceship/pages/SpaceShip'));
const LuckyNumber = lazy(() => import('../domains/luckyNumber/pages/LuckyNumber'));
const TodayFortune= lazy(() => import('../domains/todayFortune/pages/TodayFortune'));
const DreamSolve = lazy(() => import('../domains/dreamSolve/pages/DreamSolve'));

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/spaceship" element={<SpaceShip />}></Route>
        <Route path="/luckynumber" element={<LuckyNumber />}></Route>
        <Route path="/todayfortune" element={<TodayFortune />}></Route>
        <Route path="/dreamsolve" element={<DreamSolve />}></Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};
export default AppRouter;
