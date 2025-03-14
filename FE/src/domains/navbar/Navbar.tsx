import React, { useState } from 'react';
import { MdHomeFilled } from 'react-icons/md';
import { BsFillRocketTakeoffFill } from 'react-icons/bs';
import { VscSearch } from 'react-icons/vsc';
import { FaRegBell } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import SearchModal from '../search/modal/SearchModal'; // 모달 임포트

const Navbar = () => {
  // 모달 열림 여부
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기
  const openModal = () => setIsModalOpen(true);
  // 모달 닫기
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <nav className="fixed top-0 flex w-fit left-1/2 transform -translate-x-1/2 text-3xl text-gray-400 opacity-40 items-center justify-center gap-15 p-3 bg-transparent z-50">
        {/* home */}
        <Link
          to="/"
          className="hover:text-white">
          <MdHomeFilled />
        </Link>
        {/* Rocket */}
        <Link
          to="/spaceship"
          className="hover:text-white">
          <BsFillRocketTakeoffFill />
        </Link>
        {/* search (클릭하면 모달 열림) */}
        <VscSearch
          onClick={openModal}
          className="hover:text-white cursor-pointer"
        />
        {/* bell */}
        <FaRegBell className="hover:text-white cursor-pointer" />
      </nav>

      {/* SearchModal 컴포넌트 */}
      <SearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default Navbar;
