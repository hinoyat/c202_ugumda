// 우주선 내 버튼들
import { useNavigate } from 'react-router-dom';
import '../themes/SpaceShip.css';
import { IoClose } from 'react-icons/io5';

const SpaceShipContent = () => {
  const nav = useNavigate();
  const onClickLucky = () => {
    nav('/luckynumber');
  };
  const onClickDream = () => {
    nav('/dreamsolve');
  };
  const onClickFortune = () => {
    nav('/todayfortune');
  };
  const onClickHome = () => {
    nav('/');
  };
  const onClickEditMyInformation = () => {
    nav('/passwordcheck');
  };

  return (
    <div>
      {/* 닫기 버튼 */}
      <div
        className="absolute z-40 top-[2%] right-[1%] cursor-pointer"
        onClick={onClickHome}>
        <IoClose className="text-white text-4xl" />
      </div>

      {/* 메뉴 버튼들 */}
      <div className="absolute top-[44%] w-full flex justify-center items-center gap-x-65 z-20">
        {/* 행운번호 뽑기 버튼 */}
        <button
          onClick={onClickLucky}
          className="text-white text-2xl font-bold cursor-pointer hover:scale-105 transition-transform neon-text">
          행운번호 뽑기
        </button>

        {/* 꿈해몽 하기 버튼 */}
        <button
          onClick={onClickDream}
          className="text-white text-2xl font-bold cursor-pointer hover:scale-105 transition-transform neon-text">
          꿈해몽 하기
        </button>

        {/* 오늘의 운세 버튼 */}
        <button
          onClick={onClickFortune}
          className="text-white text-2xl font-bold cursor-pointer hover:scale-105 transition-transform neon-text">
          오늘의 운세
        </button>
      </div>

      {/* 회원정보수정 버튼 */}
      <div className="absolute z-20 top-[80%] left-1/2 transform -translate-x-1/2">
        <button
          onClick={onClickEditMyInformation}
          className="shadow__btn text-base text-white cursor-pointer hover:scale-105 transition-transform">
          회원정보수정
        </button>
      </div>
    </div>
  );
};

export default SpaceShipContent;
