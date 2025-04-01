import React, { useState } from 'react';
import { MdHomeFilled } from 'react-icons/md';
import { BsFillRocketTakeoffFill } from 'react-icons/bs';
import { VscSearch } from 'react-icons/vsc';
import { FaRegBell } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import SearchModal from '../search/modal/SearchModal'; // 모달 임포트
import { Tooltip } from 'react-tooltip';

const Navbar = () => {
  // 모달 열림 여부
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기
  const openModal = () => setIsModalOpen(true);
  // 모달 닫기
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <nav className="fixed top-0 flex w-fit left-1/2 transform -translate-x-1/2 text-2xl text-gray-400 opacity-90 items-center justify-center gap-15 p-6 bg-transparent z-50">
        {/* home */}
        <Link
          to="/" // 여기 visituserpage 불러와서 넘겨야할 것 같아
          className="hover:text-white"
          data-tooltip-id="home-tooltip"
          data-tooltip-content="홈으로 이동">
          <MdHomeFilled />
        </Link>

        {/* Rocket */}
        <Link
          to="/spaceship"
          // onClick={onclose}
          className="hover:text-white"
          data-tooltip-id="Guestbook"
          data-tooltip-content="방명록">
          <BsFillRocketTakeoffFill className="w-5 h-5" />
        </Link>


        {/* search (클릭하면 모달 열림) */}
        <VscSearch
          onClick={openModal}
          className="hover:text-white cursor-pointer w-5 h-5"
          data-tooltip-id="search-tooltip"
          data-tooltip-content="검색하기"
        />

        {/* bell */}
        <FaRegBell
          className="hover:text-white cursor-pointer w-5 h-5"
          data-tooltip-id="notification-tooltip"
          data-tooltip-content="알림"
        />
      </nav>
      {/* 툴팁 컴포넌트들 */}
      <Tooltip
        id="home-tooltip"
        place="bottom"
        style={{ zIndex: 9999 }}
      />
      <Tooltip
        id="spaceship-tooltip"
        place="bottom"
        style={{ zIndex: 9999 }}
      />
      <Tooltip
        id="search-tooltip"
        place="bottom"
        style={{ zIndex: 9999 }}
      />
      <Tooltip
        id="notification-tooltip"
        place="bottom"
        style={{ zIndex: 9999 }}
      />

      {/* SearchModal 컴포넌트 */}
      <SearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default Navbar;
