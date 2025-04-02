import { useSelector } from 'react-redux';
import { selectVisitUser } from '../stores/userSelectors';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { logoutUser } from '@/stores/auth/authThunks';
import { useNavigate } from 'react-router-dom';
import api from '@/apis/apiClient';

interface UserSpaceHeaderProps {
  nickname: string | undefined; // 닉네임 ( 내 닉네임 or 다른 사람 닉네임)
  isMySpace?: boolean;
}
const UserSpaceHeader = ({ nickname, isMySpace }: UserSpaceHeaderProps) => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const [buttonLabel, setButtonLabel] = useState('');

  const currentOwnerUser = useSelector(selectVisitUser);
  const isOwnerSubscribe = currentOwnerUser.isSubscribed;

  // buttonLabel 업데이트 로직
  useEffect(() => {
    console.log('내 우주인가?: ' + isMySpace);
    console.log('구독 상태: ', isOwnerSubscribe);

    const buttonText = isMySpace
      ? '로그아웃'
      : isOwnerSubscribe === 'Y'
        ? '구독취소'
        : '구독';
    
    setButtonLabel(buttonText);
  }, [isMySpace, isOwnerSubscribe, currentOwnerUser.userSeq]);

  const handleButtonClick = async () => {
    if (buttonLabel === '로그아웃') {
      // 로그아웃 버튼 로직
      await dispatch(logoutUser());
      nav('/intro', { replace: true });
      window.location.reload();
    } else if (buttonLabel === '구독취소') {
      try {
        await api.patch(
          `/subscription/${currentOwnerUser.userSeq}`
        );
        // API 호출 후 상태 변경하지 않고 기다림 (리덕스 상태가 업데이트되면 자동으로 UI 변경)
      } catch (error) {
        console.error(error, '에러가 발생하였습니다.');
      }
    } else {
      try {
        await api.patch(
          `/subscription/${currentOwnerUser.userSeq}`
        );
        // API 호출 후 상태 변경하지 않고 기다림 (리덕스 상태가 업데이트되면 자동으로 UI 변경)
      } catch (error) {
        console.error(error, '에러가 발생하였습니다.');
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