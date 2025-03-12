import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-screen text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/bg_error.png')" }}
    >
      {/* 에러 제목 */}
      <h1 className="text-4xl font-bold mb-2">404</h1>
      {/* 에러 설명 */}
      <p className="text-lg mb-8 text-gray-300">Page Not Found</p>

      {/* 우주인 아이콘(이미지) */}
      <img
        src="astronaut.png"
        alt="Astronaut icon"
        className="w-80 h-80 object-contain animate-bounce"
      />

      <Link to ="/">
      <button className="border p-2 rounded cursor-pointer hover:bg-white hover:text-black">홈으로 이동하기</button>
      </Link>
    </div>
  );
};

export default ErrorPage;
