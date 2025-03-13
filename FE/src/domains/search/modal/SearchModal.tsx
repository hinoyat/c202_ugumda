import React, { useState } from 'react';
import DiarySearch from '../components/DiarySearch';
import UserSearch from '../components/UserSearch';
import { IoClose } from 'react-icons/io5';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'diary' | 'user'>('diary');

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 z-10 backdrop-blur-[2px]"></div>
      <div
        className="absolute w-[80%] h-[85%] py-10 px-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#6E6E6E]/47 z-11 flex flex-col items-center">
        <div
          className="absolute z-40 top-[2%] right-[1%] cursor-pointer"
          onClick={onClose}
        >
          <IoClose className="text-white text-4xl" />
        </div>
        <div className="flex gap-10 text-white text-3xl">
          <button
            onClick={() => setActiveTab('diary')}
            className={`${
              activeTab === 'diary'
                ? 'font-bold underline underline-offset-6'
                : 'hover:font-bold hover:underline hover:underline-offset-5'
            } cursor-pointer`}
          >
            일기검색
          </button>
          <p>|</p>
          <button
            onClick={() => setActiveTab('user')}
            className={`${
              activeTab === 'user'
                ? 'font-bold underline underline-offset-6'
                : 'hover:font-bold hover:underline hover:underline-offset-5'
            } cursor-pointer`}
          >
            유저검색
          </button>
        </div>

        {activeTab === 'diary' && <DiarySearch />}
        {activeTab === 'user' && <UserSearch />}
      </div>
    </div>
  );
};

export default SearchModal;
