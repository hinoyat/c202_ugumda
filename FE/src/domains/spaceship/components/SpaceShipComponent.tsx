interface SpaceShipComponentProps {
  children: React.ReactNode;
}

const SpaceShipComponent = ({ children }: SpaceShipComponentProps) => {
  return (
    <div className="relative w-screen h-screen galmuri-font">
      <div className="w-full h-full bg-black"></div>
      <img
        src="spaceship.png"
        alt=""
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      {children}
    </div>
  );
};

export default SpaceShipComponent;
