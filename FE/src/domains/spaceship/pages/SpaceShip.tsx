import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const SpaceShip = () => {
    const nav = useNavigate();
    const onClickLucky = () => {
        nav("/luckynumber")
    }
    const onClickDream = () => {
        nav("/dreamsolve");
    }
    const onClickFortune = () => {
        nav("/todayfortune");
    }
    const onClickHome =() => {
        nav("/");
    }
    

    const glowingTextStyle = {
      textShadow: '0 0 5px #9decf9, 0 0 10px #9decf9, 0 0 15px #67e8f9'
    };
    
 
    const glowingButtonStyle = {
      boxShadow: '0 0 5px #9decf9, 0 0 10px #9decf9, 0 0 15px #67e8f9, 0 0 20px #67e8f9',
      transition: 'box-shadow 0.3s ease'
    };
    
  return (
    <div className="relative w-screen h-screen galmuri-font">
      <div className="w-full h-full bg-black"></div>
      <img 
        src="spaceship.png" 
        alt="" 
        className="absolute top-0 left-0 w-full h-full z-10" 
      />

      <div className="absolute top-[44%] w-full flex justify-center items-center gap-x-59 z-20">
        <button 
          onClick={onClickLucky} 
          className="text-white text-4xl font-bold cursor-pointer hover:scale-105 transition-transform" 
          style={glowingTextStyle}
        >
          행운번호 뽑기
        </button>
        <button 
          onClick={onClickDream} 
          className="text-white text-4xl font-bold cursor-pointer hover:scale-105 transition-transform" 
          style={glowingTextStyle}
        >
          꿈해몽 하기
        </button>
        <button 
          onClick={onClickFortune} 
          className="text-white text-4xl font-bold cursor-pointer hover:scale-105 transition-transform" 
          style={glowingTextStyle}
        >
          오늘의 운세
        </button>
      </div>

      <div 
        className="absolute z-20 top-[80%] left-[39.8%] bg-cyan-300 w-75 h-13 flex items-center justify-center rounded animate-pulse"
        style={glowingButtonStyle}
      >
        <button 
          className="text-xl text-white cursor-pointer w-full h-full hover:scale-105 transition-transform"
          style={glowingTextStyle}
        >
          회원정보수정
        </button>
      </div>

      <div className="absolute z-40 top-[2%] right-[1%] cursor-pointer" onClick={onClickHome}>
        <IoClose className="text-white text-4xl"/>
      </div>

    </div>
  );
};

export default SpaceShip;