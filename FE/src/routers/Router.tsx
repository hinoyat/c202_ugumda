import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Login = lazy(() => import('../domains/login/pages/Login'));

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={<Login />}></Route>
      </Routes>
    </Suspense>
  );
};
