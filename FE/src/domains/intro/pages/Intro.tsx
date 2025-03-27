import { Link } from 'react-router-dom';

const Intro = () => {
  return (
    <>
      <div className="m-auto p-16 text-center">
        <h1 className="text-5xl">안녕 c202친구들~</h1>
        <Link
          className="hover:text-blue-700"
          to="/login">
          login
        </Link>
      </div>
    </>
  );
};

export default Intro;
