import GuestBookList from './components/GuestBookList';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import MainPage from '../mainpage/pages/MainPage';
import exampleProfile from "@/assets/images/exampleProfile.svg";

interface MainPageProps {
  onClose: () => void;
}
const GuestBook: React.FC<MainPageProps> = ({ onClose }) => {
  const owner = {
    user_id: 1,
    nickname: '어린왕자',
    introduction: '안녕하세요 한줄 소개글 테스트 중입니다.',
    profile: `${exampleProfile}`
  };
  const nav = useNavigate();
  const onClickHome = () => {
    nav('/');
  };
  return (
    <div className="">
      {/* <MainPage /> */}
      <div className="absolute inset-0 backdrop-blur-lg"></div>
      <div className="absolute w-[80%] h-[85%] bg-[#6E6E6E] opacity-80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="absolute w-[80%] h-[85%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="absolute z-40 top-[1%] right-[0.5%] cursor-pointer"
          onClick={onClose}>
          <IoClose className="text-white text-4xl hover:text-gray-400" />
        </div>
        <div className="flex flex-col p-10 gap-10 w-full">
          {/*헤더 부분 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-white font-semibold text-2xl">
                {owner.nickname} 님의 방명록
              </h1>
              <p className="ml-1 text-white font-light text-sm">
                {owner.introduction}
              </p>
            </div>
            <img
              src={owner.profile}
              alt=""
              className="w-15"
            />
          </div>

          {/*방명록 남기는 부분 */}
          <div className="flex gap-7  justify-center">
            <input
              type="text"
              placeholder="내용을 입력해 주세요."
              className="w-[75%] p-1 border-b border-gray-300 text-gray-300 outline-none"
            />
            <button className="bg-neutral-700 px-2 py-1 text-white rounded text-[13px] w-[10%] cursor-pointer hover:bg-neutral-400">
              남기기
            </button>
          </div>

          <GuestBookList />
        </div>
      </div>
    </div>
  );
};

export default GuestBook;
