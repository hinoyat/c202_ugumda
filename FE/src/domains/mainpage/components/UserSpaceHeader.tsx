import { useSelector } from 'react-redux';
import { selectVisitUser } from '../stores/userSelectors';
import { useAppDispatch } from '@/hooks/hooks';
import { logoutUser } from '@/stores/auth/authThunks';
import { useNavigate } from 'react-router-dom';
import api from '@/apis/apiClient';
import { updateSubscriptionStatus } from '../stores/userSlice';
import { useEffect, useState } from 'react';
import { getIconById } from '@/hooks/ProfileIcons';

interface UserSpaceHeaderProps {
  nickname: string | undefined;
  icon: number;
  isMySpace?: boolean;
}

const UserSpaceHeader = ({ nickname, icon, isMySpace }: UserSpaceHeaderProps) => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const currentOwnerUser = useSelector(selectVisitUser);

  // 로컬 상태로 구독 상태 관리 추가
  const [isSubscribed, setIsSubscribed] = useState(
    currentOwnerUser?.isSubscribed === 'Y'
  );

  // 디버깅: Redux 상태 변경 확인 + 로컬 상태 동기화
  useEffect(() => {
    if (currentOwnerUser) {
      setIsSubscribed(currentOwnerUser.isSubscribed === 'Y');
    }
  }, [currentOwnerUser]);

  const buttonLabel = isMySpace
    ? '로그아웃'
    : isSubscribed
      ? '구독취소'
      : '구독';

  const handleButtonClick = async () => {
    console.log('Button clicked. Current label:', buttonLabel);
    if (buttonLabel === '로그아웃') {
      await dispatch(logoutUser());
      nav('/intro', { replace: true });
      window.location.reload();
    } else {
      try {
        console.log('Sending API patch for userSeq:', currentOwnerUser.userSeq);
        const response = await api.patch(
          `/subscription/${currentOwnerUser.userSeq}`
        );
        console.log('API response:', response);

        // API 응답 구조 확인 및 예외 처리
        const newStatus =
          response.data?.isSubscribed || (isSubscribed ? 'N' : 'Y'); // 응답이 없을 경우 토글

        // 로컬 상태 즉시 업데이트
        setIsSubscribed(newStatus === 'Y');

        // Redux 상태도 업데이트
        dispatch(updateSubscriptionStatus(newStatus));
      } catch (error) {
        console.error('에러가 발생하였습니다:', error);
        // 오류 발생시 사용자에게 알림 (선택사항)
        alert('구독 상태 변경 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-baseline">
        {isMySpace ? (
          <div className="flex items-center">
            <img src={getIconById(icon)} alt="내 프로필 사진" className="w-8 h-8" />
          <h3 className="text-base font-bold text-white/90 ml-1">
            나의 우주 ☄️
          </h3>
          </div>
        ) : (
          <div className="flex items-center">
            <img src={getIconById(icon)} alt="" className="w-9 h-9"/>
            <>
              <h3 className="text-base font-bold text-[#ffd700]">{nickname}</h3>
              <p className="text-sm text-white/90 ml-1">님의 우주</p>
            </>
          </div>
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
