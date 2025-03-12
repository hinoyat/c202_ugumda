import { useNavigate } from "react-router-dom";
import "../themes/SpaceShip.css";

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
  const onClickEditMyInformation =() => {
    nav('/passwordcheck')
  }
  const glowingTextStyle = {
    textShadow: '0 0 5px #9decf9, 0 0 10px #9decf9, 0 0 15px #67e8f9',
  };

  const glowingButtonStyle = {
    boxShadow:
      '0 0 5px #9decf9, 0 0 10px #9decf9, 0 0 15px #67e8f9, 0 0 20px #67e8f9',
    transition: 'box-shadow 0.3s ease',
  };

  return (
    <div>
        <div className="absolute top-[44%] w-full flex justify-center items-center gap-x-70 z-20">
        <button
          onClick={onClickLucky}
          className="text-white text-3xl font-bold cursor-pointer hover:scale-105 transition-transform"
          style={glowingTextStyle}>
          행운번호 뽑기
        </button>
        <button
          onClick={onClickDream}
          className="text-white text-3xl font-bold cursor-pointer hover:scale-105 transition-transform"
          style={glowingTextStyle}>
          꿈해몽 하기
        </button>
        <button
          onClick={onClickFortune}
          className="text-white text-3xl font-bold cursor-pointer hover:scale-105 transition-transform"
          style={glowingTextStyle}>
          오늘의 운세
        </button>
      </div>

      <div className="absolute z-20 top-[80%] left-1/2 transform -translate-x-1/2 shadow__btn">
        <button
          onClick={onClickEditMyInformation}
          className="text-lg text-white cursor-pointer w-full h-full hover:scale-105 transition-transform"
          style={glowingTextStyle}>
          회원정보수정
        </button>
      </div>
    </div>
  )
}

export default SpaceShipContent