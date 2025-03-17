// 우주선 레이아웃 담당 부모 컴포넌트

import spaceShip_bg from '@/assets/images/spaceShip_bg.svg';

interface SpaceShipComponentProps {
  children: React.ReactNode;
}

const SpaceShipComponent = ({ children }: SpaceShipComponentProps) => {
  return (
    <div className="relative w-screen h-screen galmuri-font">
      <div className="w-full h-full bg-black"></div>
      <img
        src={spaceShip_bg}
        alt=""
        className="absolute top-0 left-0 w-full h-full z-10 opacity-75"
      />
      {children}
    </div>
  );
};

export default SpaceShipComponent;
