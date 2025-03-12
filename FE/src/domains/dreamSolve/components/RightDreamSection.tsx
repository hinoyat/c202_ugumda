import DreamContent from './DreamContent';
import DreamSolveContent from './DreamSolveContent';

const RightDreamSection = () => {
  return (
    <div className="basis-2/3">
      <div className="w-full h-full relative">
        <img
          src="dreamFrame.png"
          className="w-full h-full object-fill"
        />

        <div className="absolute w-[85%] h-[85%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3">
          <div className="flex flex-col items-center justify-around h-full">
            <div className="w-full h-[50%] flex flex-col items-center justify-center">
              <DreamContent />
            </div>
            <div className="w-full h-[50%] flex flex-col items-center justify-center">
              <DreamSolveContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RightDreamSection;
