// SearchModal.tsx
import { useState } from 'react';
import DiarySearch from '../components/DiarySearch';
import UserSearch from '../components/UserSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'diary' | 'user'>('diary');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {/* 모달 컨테이너 */}
      <div className="bg-neutral-800 p-8 rounded-md shadow-md w-full max-w-6xl relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
          ✕
        </button>

        {/* 탭 영역 */}
        <div className="flex items-center justify-center space-x-8 mb-4 text-white p-2">
          <button
            className={` ${
              activeTab === 'diary'
                ? 'border-b-2 border-white font-semibold'
                : ''
            } cursor-pointer`}
            onClick={() => setActiveTab('diary')}>
            일기 검색
          </button>
          <p className="text-2xl">|</p>
          <button
            className={` ${
              activeTab === 'user'
                ? 'border-b-2 border-white font-semibold'
                : ''
            } cursor-pointer`}
            onClick={() => setActiveTab('user')}>
            유저 검색
          </button>
        </div>

        {/* 검색 바 영역 */}
        {/* 여기서 입력한 텍스트를 DiarySearch/UserSearch에 넘기고 싶다면 props로 전달하거나,
            각 컴포넌트 내부에서 별도 입력 필드를 두는 방식으로 설계할 수 있습니다. */}
        <div className="flex items-center justify-center max-w-6xl mb-6 gap-3">
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            className="flex-grow border-b-2 border-gray-300 rounded px-4 py-1 focus:outline-none text-white bg-transparent"
          />
          <button className="px-4 py-1 bg-neutral-700 text-white rounded hover:bg-neutral-600 cursor-pointer">
            검색
          </button>
        </div>

        {/* 탭에 따라 다른 컴포넌트 렌더링 */}
        {activeTab === 'diary' && <DiarySearch />}
        {activeTab === 'user' && <UserSearch />}
      </div>
    </div>
  );
};

export default SearchModal;
