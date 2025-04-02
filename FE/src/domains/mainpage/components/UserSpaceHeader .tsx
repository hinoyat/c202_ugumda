import { useSelector, UseSelector } from 'react-redux';
import { selectVisitUser } from '../stores/userSelectors';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { logoutUser } from '@/stores/auth/authThunks';
import { useNavigate } from 'react-router-dom';
import api from '@/apis/apiClient';
import { current } from '@reduxjs/toolkit';

interface UserSpaceHeaderProps {
  nickname: string | undefined; // 닉네임 ( 내 닉네임 or 다른 사람 닉네임)
  isMySpace?: boolean;
}
const UserSpaceHeader = ({ nickname, isMySpace }: UserSpaceHeaderProps) => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const [isSubscribed, setIsSubscribe] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('');

  const currentOwnerUser = useSelector(selectVisitUser);
  const isOwnerSubscribe = currentOwnerUser.isSubscribed;

  // console.log('현재 페이지 주인: ' + currentOwnerUser.isSubscribed);
  // const buttonLabel = isMySpace ? "로그아웃": is
  useEffect(() => {
    console.log('내 우주인가?: ' + isMySpace);

    const buttonText = isMySpace
      ? '로그아웃'
      : isOwnerSubscribe === 'Y'
        ? '구독취소'
        : '구독';
    setButtonLabel(buttonText);
    console.log('dfdfdsfsdf', isOwnerSubscribe);
  }, [currentOwnerUser.isSubscribed]);

  const handleButtonClick = async () => {
    if (buttonLabel === '로그아웃') {
      // 로그아웃 버튼 로직
      await dispatch(logoutUser());
      nav('/intro', { replace: true });
      window.location.reload();
    } else if (buttonLabel === '구독취소') {
      try {
        const response = await api.patch(
          `/subscription/${currentOwnerUser.userSeq}`
        );
      } catch (error) {
        console.error(error, '에러가 발생하였습니다.');
      } finally {
        setButtonLabel('구독');
      }
    } else {
      try {
        const response = await api.patch(
          `/subscription/${currentOwnerUser.userSeq}`
        );
      } catch (error) {
        console.error(error, '에러가 발생하였습니다.');
      } finally {
        setButtonLabel('구독취소');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-baseline">
        {isMySpace ? (
          <h3 className="text-base font-bold text-white/90 ml-1">
            나의 우주 ☄️
          </h3>
        ) : (
          <>
            <h3 className="text-base font-bold text-white/90">{nickname}</h3>
            <p className="text-sm text-white/90 ml-1">님의 우주</p>
          </>
        )}
      </div>
      <button
        onClick={handleButtonClick}
        className="mt-2 w-[80px] h-[25px] bg-white/50 text-white rounded-[6px] text-xs cursor-pointer hover:bg-white/70 transition-colors">
        {buttonLabel}
      </button>
    </div>
  );
};

export default UserSpaceHeader;
