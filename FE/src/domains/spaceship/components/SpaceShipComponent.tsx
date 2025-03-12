import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import '../themes/SpaceShip.css';
import SpaceShipContent from '../components/SpaceShipContent';
import PasswordCheckModal from '../components/PasswordCheckModal';

interface SpaceShipComponentProps {
  children: React.ReactNode;
}

const SpaceShipComponent = ({ children }: SpaceShipComponentProps) => {
  const nav = useNavigate();

  // 기본 동작
  const onClickHome = () => {
    nav('/');
  };

  // SpaceShipContent일 때 동작할 함수
  const onClickEditMyInformation = () => {
    nav('/spaceship');
  };

  // children의 타입에 따라 클릭 핸들러 결정
  let handleClick: () => void = onClickHome; // 기본값

  if (React.isValidElement(children)) {
    // children이 SpaceShipContent 컴포넌트라면 onClickEditMyInformation 사용
    if (children.type === PasswordCheckModal) {
      handleClick = onClickEditMyInformation;
    }
  }

  return (
    <div className="relative w-screen h-screen galmuri-font">
      <div className="w-full h-full bg-black"></div>
      <img
        src="spaceship.png"
        alt=""
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      {children}
      <div
        className="absolute z-40 top-[2%] right-[1%] cursor-pointer"
        onClick={handleClick}
      >
        <IoClose className="text-white text-4xl" />
      </div>
    </div>
  );
};

export default SpaceShipComponent;
