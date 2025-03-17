import '../styles/DiarySearch.css';
import UserList from './UserList';
import exampleProfile from "@/assets/images/exampleProfile.svg"


const UserSearch = () => {
  const UserData = [
    {
      id: 1,
      profile: `${exampleProfile}`,
      nickname: '서린공쥬',
      account: 'PrincessKim1',
      subscribe: true,
    },
    {
      id: 2,
      profile: `${exampleProfile}`,
      nickname: '채현공쥬',
      account: 'PrincessLim1',
      subscribe: false,
    },
    {
      id: 3,
      profile: `${exampleProfile}`,
      nickname: '희현공쥬',
      account: 'PrincessJang1',
      subscribe: false,
    },
    {
      id: 4,
      profile: `${exampleProfile}`,
      nickname: '현수공쥬',
      account: 'PrincessJung1',
      subscribe: true,
    },
    {
      id: 5,
      profile: `${exampleProfile}`,
      nickname: '킹갓현호공듀',
      account: 'KingGodBestGeneralHinoyatPrincess1',
      subscribe: true,
    },
  ];
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-5 w-full justify-center">
        <input
          type="text"
          placeholder="내용을 입력해 주세요"
          className="border-b border-white p-1 basis-63/100  placeholder:text-[#FFFFFF]/70"
        />
        <button className="bg-[#545454] text-white rounded px-3 w-20">
          검색{' '}
        </button>
      </div>
      {/*체크 박스 시작 */}
      <div className="flex gap-4 w-full justify-start pl-30">
        <div className="flex gap-1.5 items-center">
          <label className="cont">
            <input
              type="checkbox"
              defaultChecked
              value="닉네임"
            />
            <span></span>
          </label>
          <p className="text-white">닉네임</p>
        </div>

        <div className="flex gap-1.5 items-center">
          <label className="cont">
            <input
              type="checkbox"
              defaultChecked
              value="아이디"
            />
            <span></span>
          </label>
          <p className="text-white">아이디</p>
        </div>

        <div className="flex gap-1.5 items-center">
          <label className="cont">
            <input
              type="checkbox"
              defaultChecked
              value="구독중"
            />
            <span></span>
          </label>
          <p className="text-white">구독중</p>
        </div>
      </div>
      {/*체크 박스 끝 */}
      <div className="w-full h-[410px] overflow-y-auto pr-4 custom-scrollbar">
        <UserList data={UserData} />
      </div>
    </div>
  );
};
export default UserSearch;
