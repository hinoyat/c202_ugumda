import DreamSolveLine from './DreamSolveLine';
import DreamMeaningLog from './DreamMeaningLog';
import DreamHistory from './DreamHistory';

const LeftDreamSection = () => {
  return (
    <div className="basis-1/3 p-3 flex flex-col gap-3">
      <div className="flex flex-col items-center gap-1 mt-3">
        <img
          src="defaultProfile.png"
          alt="임시 프로필 사진"
          className="w-20 h-20 mt-3"
        />
        <p className="text-neutral-500 text-[17px]">2002.04.23</p>
        <h1 className="text-white text-[15px]">어린왕자</h1>
      </div>

      <div className="flex items-center justify-center">
        <DreamSolveLine />
      </div>

      {/* DreamMeaningLog 영역: 데이터 유무와 상관없이 최소 200px 영역 확보 */}
      <div className="">
        <DreamMeaningLog />
      </div>

      <div className="flex items-center justify-center">
        <DreamSolveLine />
      </div>

      {/* DreamHistory 영역: 데이터 유무와 상관없이 최소 300px 영역 확보 */}
      <div className="">
        <DreamHistory />
      </div>
    </div>
  );
};
export default LeftDreamSection;
