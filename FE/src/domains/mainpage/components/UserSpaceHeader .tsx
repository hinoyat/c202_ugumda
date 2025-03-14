// 메인페이지 좌측 상단의
// [닉네임님의 페이지 입니다.] + 로그아웃/구독취소 버튼

interface UserSpaceHeaderProps {
  nickname: string; // 닉네임 ( 내 닉네임 or 다른 사람 닉네임)
  onButtonClick: () => void; // 버튼 클릭 이벤트 (로그아웃 or 구독취소)
  buttonLabel: string;
}
const UserSpaceHeader = ({
  nickname,
  onButtonClick,
  buttonLabel,
}: UserSpaceHeaderProps) => {
  return (
    <div className="p-4">
      <div className="flex items-baseline">
        <h3 className="text-base font-bold text-white/90">{nickname}</h3>
        <p className="text-sm text-white/90 ml-1">님의 우주</p>
      </div>
      <button
        onClick={onButtonClick}
        className="mt-2 w-[80px] h-[25px] bg-white/50 text-white rounded-[6px] text-xs cursor-pointer hover:bg-white/70 transition-colors">
        {buttonLabel}
      </button>
    </div>
  );
};

export default UserSpaceHeader;
