import api from '@/apis/apiClient';
import '../styles/DiarySearch.css';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';

// User 인터페이스 정의
interface User {
  userSeq: number;
  subscribedSeq?: number;
  username: string;
  nickname: string;
  iconSeq: number;
  birthDate?: string;
  introduction?: string | null;
  isSubscribed?: boolean;
}
interface UserSearchProps {
  onClose: () => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchFilters, setSearchFilters] = useState({
    searchNickname: true,
    searchUsername: false,
  });
  const [friends, setFriends] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 로딩 시 친구 목록 가져오기
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get('/subscription');
        const friendData = response.data.data;
        console.log('내 친구 목록:', friendData);
        setFriends(friendData);
      } catch (error) {
        console.error('친구 목록 가져오기 오류:', error);
      }
    };
    fetchFriends();
  }, []);

  // 검색어가 없을 때는 내 친구 목록 표시
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredUsers(friends);
      setUsers([]);
    }
  }, [searchText, friends]);

  // 검색 함수
  const handleSearch = async () => {
    if (!searchText.trim()) {
      setFilteredUsers(friends);
      return;
    }

    setIsLoading(true);
    try {
      // /users/search 엔드포인트로 검색 요청
      const response = await api.get('/users/search', {
        params: { keyword: searchText },
      });

      // 검색 결과에 친구 여부 표시 추가
      const userData = response.data.data.map((user: User) => {
        // 친구 목록에 있는지 확인해서 isSubscribed 필드 추가
        const isFriend = friends.some(
          (friend) =>
            friend.userSeq === user.userSeq || friend.nickname === user.nickname
        );
        return { ...user, isSubscribed: isFriend };
      });

      setUsers(userData);

      // 검색 필터 적용
      const filtered = userData.filter((user: User) => {
        const matchNickname =
          searchFilters.searchNickname &&
          user.nickname.toLowerCase().includes(searchText.toLowerCase());

        const matchUsername =
          searchFilters.searchUsername &&
          user.username.toLowerCase().includes(searchText.toLowerCase());

        return matchNickname || matchUsername;
      });

      setFilteredUsers(filtered);
    } catch (error) {
      console.error('사용자 검색 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키로 검색 실행
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 구독하기 핸들러
  const handleSubscribe = async (userSeq: number) => {
    try {
      await api.patch(`/subscription/${userSeq}`);
      // 구독 성공 후 검색 결과에서 해당 사용자 상태 업데이트
      const updatedUsers = users.map((user) =>
        user.userSeq === userSeq ? { ...user, isSubscribed: true } : user
      );
      setUsers(updatedUsers);

      // 필터링된 사용자도 업데이트
      const updatedFilteredUsers = filteredUsers.map((user) =>
        user.userSeq === userSeq ? { ...user, isSubscribed: true } : user
      );
      setFilteredUsers(updatedFilteredUsers);
    } catch (error) {
      console.error('구독 오류:', error);
    }
  };

  // 구독 취소 핸들러
  const handleUnsubscribe = async (subscribedSeq: number) => {
    try {
      await api.patch(`/subscription/${subscribedSeq}`);
      // 구독 취소 후 친구 목록에서 제거
      const updatedFriends = friends.filter(
        (friend) => friend.subscribedSeq !== subscribedSeq
      );
      setFriends(updatedFriends);

      // 현재 필터링된 목록도 업데이트
      const updatedFilteredUsers = filteredUsers.filter(
        (user) => user.subscribedSeq !== subscribedSeq
      );
      setFilteredUsers(updatedFilteredUsers);
    } catch (error) {
      console.error('구독 취소 오류:', error);
    }
  };

  // 놀러가기 핸들러
  const handleVisit = (userSeq: number) => {
    console.log('버튼 눌렸따.');

    const takeNickname = async () => {
      try {
        const response = await api.get(`/users/seq/${userSeq}`);
        const paramsNickname = response.data.data.nickname;
        onClose();
        navigate(`/${paramsNickname}`);
      } catch (error) {
        console.error(error, '닉네임 추출에 실패하였습니다.');
      }
    };

    // 함수 정의 후 실행
    takeNickname();
  };

  // 필터 변경 처리
  const handleFilterChange = (filter: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));

    // 필터 변경 시 현재 검색 결과에 새 필터 적용
    if (users.length > 0) {
      const filtered = users.filter((user) => {
        const matchNickname =
          (filter === 'searchNickname'
            ? !searchFilters.searchNickname
            : searchFilters.searchNickname) &&
          user.nickname.toLowerCase().includes(searchText.toLowerCase());

        const matchUsername =
          (filter === 'searchUsername'
            ? !searchFilters.searchUsername
            : searchFilters.searchUsername) &&
          user.username.toLowerCase().includes(searchText.toLowerCase());

        return matchNickname || matchUsername;
      });

      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 overflow-hidden">
      <div className="flex gap-5 w-full justify-center">
        <input
          type="text"
          placeholder="내용을 입력해 주세요"
          className="border-b border-white p-1 basis-63/100 placeholder:text-[#FFFFFF]/70 outline-none text-white"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="bg-[#545454] text-white rounded px-3 w-20 hover:bg-neutral-400 cursor-pointer"
          onClick={handleSearch}
          disabled={isLoading}>
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </div>

      {/* 체크 박스 시작 */}
      <div className="flex gap-4 w-full justify-start pl-20 text-[15px]">
        <div className="flex gap-1.5 items-center">
          <label className="cont">
            <input
              type="checkbox"
              checked={searchFilters.searchNickname}
              onChange={() => handleFilterChange('searchNickname')}
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
              checked={searchFilters.searchUsername}
              onChange={() => handleFilterChange('searchUsername')}
              value="아이디"
            />
            <span></span>
          </label>
          <p className="text-white">아이디</p>
        </div>
      </div>
      {/* 체크 박스 끝 */}

      {isLoading ? (
        <div className="text-center text-white">검색 중...</div>
      ) : (
        <div className="w-full pr-4 overflow-y-scroll custom-scrollbar">
          <UserList
            data={filteredUsers}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
            onVisit={handleVisit}
          />
        </div>
      )}
    </div>
  );
};

export default UserSearch;
