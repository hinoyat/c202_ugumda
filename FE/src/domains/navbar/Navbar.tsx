import { MdHomeFilled } from 'react-icons/md';
import { BsFillRocketTakeoffFill } from 'react-icons/bs';
import { VscSearch } from 'react-icons/vsc';
import { FaRegBell } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 flex w-full text-3xl text-gray-400 opacity-40 items-center justify-center gap-15 p-3 bg-transparent">
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
      {/* search */}
      <VscSearch className="hover:text-white cursor-pointer" />
      {/* bell */}
      <FaRegBell className="hover:text-white cursor-pointer" />
    </nav>
  );
};

export default Navbar;
