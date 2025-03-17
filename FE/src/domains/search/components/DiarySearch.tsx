import '../styles/DiarySearch.css';
import DiaryList from './DiaryList';
import exampleProfile from "@/assets/images/exampleProfile.svg"

const DiarySearch = () => {
  const sampleData = [
    {
      id: 1,
      title: '첫 번째 일기',
      content:
        '오늘은 날씨가 참 좋았다...ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
      profile: `${exampleProfile}`,
      user: '닉네임1',
      tags: ['#태그1', '#태그2'],
    },
    {
      id: 2,
      title: '두 번째 일기',
      content: '내용이 조금 길어질 수 있다...',
      profile: `${exampleProfile}`,
      user: '닉네임2',
      tags: ['#태그3', '#태그4'],
    },
    {
      id: 3,
      title: '세 번째 일기',
      content:
        '내용이 조금 길어질 수 있다...ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇssssssss',
      profile: `${exampleProfile}`,
      user: '닉네임3',
      tags: ['#태그3', '#태그4', '태그5'],
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
              value="현재 우주"
            />
            <span></span>
          </label>
          <p className="text-white">현재 우주</p>
        </div>

        <div className="flex gap-1.5 items-center">
          <label className="cont">
            <input
              type="checkbox"
              defaultChecked
              value="제목"
            />
            <span></span>
          </label>
          <p className="text-white">제목</p>
        </div>

        <div className="flex gap-1.5 items-center">
          <label className="cont">
            <input
              type="checkbox"
              defaultChecked
              value="내용"
            />
            <span></span>
          </label>
          <p className="text-white">내용</p>
        </div>

        <div className="flex gap-1.5 items-center">
          <label className="cont">
            <input
              type="checkbox"
              defaultChecked
              value="태그"
            />
            <span></span>
          </label>
          <p className="text-white">태그</p>
        </div>
      </div>
      {/*체크 박스 끝 */}
      <div className="w-full h-[410px] overflow-y-auto pr-4 custom-scrollbar">
        <DiaryList data={sampleData} />
      </div>
    </div>
  );
};

export default DiarySearch;
