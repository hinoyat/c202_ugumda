import React from 'react';
interface UserListProps {
  data: {
    id: number;
    profile: string;
    nickname: string;
    account: string;
    subscribe: boolean;
  }[];
}

const UserList: React.FC<UserListProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-5 mt-4">
      {data.map((users) => (
        <div
          key={users.id}
          className="bg-[#6E6E6E]/47 flex px-15 py-5 gap-5 justify-between">
          <div className="flex items-center gap-2">
            <img
              src={users.profile}
              className="w-9"
            />
            <p className="text-white text-lg">{users.nickname}</p>
          </div>

          <div className="flex items-center">
            <p className="text-white text-lg">{users.account}</p>
          </div>

          <div className="flex gap-3 text-white outline:none">
            <button className="bg-[#363736] text-white  py-1 w-28 rounded cursor-pointer hover:bg-neutral-500">
              {users.subscribe ? '구독취소' : '구독'}
            </button>
            <button className="bg-[#363736] text-white py-1 w-28 rounded cursor-pointer hover:bg-neutral-500">
              놀러가기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
