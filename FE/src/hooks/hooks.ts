import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/stores/store';

// Redux Toolkit Thunk를 지원하는 `useAppDispatch` 생성
export const useAppDispatch: () => AppDispatch = useDispatch;
