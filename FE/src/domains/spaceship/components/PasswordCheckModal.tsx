import { AiOutlineEnter } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const PasswordCheckModal = () => {
    const glowingTextStyle = {
        textShadow: '0 0 5px #9decf9, 0 0 10px #9decf9, 0 0 15px #67e8f9',
      };

    const nav = useNavigate();
    {/*아직 기능 ㄴㄴ api 받아서 비밀번화 확인해서 맞으면 이 onClick함수 사용하도록 */}
    {/* 지금은 디자인 단계니까 enter 누르면 myinformation으로 이동되도록 할게여 */}
    {/* 꼭 나중에 api 받으면 나중에 button onclick함수 꼬곢꼬꼬까ㅗ꼮 고치기 */}
    const onClickGoMyInfomation = () => {
        nav('/myinformation');
    }

  return (
    <div className="absolute inset-0">
      {/* 전체 영역을 덮는 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black opacity-50 z-20"></div>
      <img
        src="passwordcheck.png"
        alt=""
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-200 animate-pulse"
      />
      <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 z-50 tracking-widest animate-pulse flex flex-col items-center gap-5">
            <h1 className="text-white text-3xl "
            style={glowingTextStyle}
            >ENTER PASSWORD!!!</h1>

            <div className="flex items-center justify-center gap-5 ml-10">
                <input type="password" className="text-cyan-300 text-[90px] w-120 h-20"/>
                <button onClick={onClickGoMyInfomation} className="cursor-pointer"><AiOutlineEnter className="text-cyan-300 text-[40px]"/></button>
            </div>
      </div>
    </div>
  );
};

export default PasswordCheckModal;
