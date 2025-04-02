import { useEffect, useState } from 'react';
import '../styles/DiarySearch.css';
import DiaryList from './DiaryList';
import api from '@/apis/apiClient';

const DiarySearch = () => {
  const [diaryData, setDiaryData] = useState({
    timestamp: '',
    status: 200,
    message: '',
    data: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOptions, setSearchOptions] = useState({
    currentUserOnly: true,
    searchTitle: true,
    searchContent: true,
    searchTag: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 데이터 로드
    loadSearchData();
  }, []);

  const loadSearchData = async () => {
    setIsLoading(true);
    try {
      // 초기 로드 시 기본 검색 조건 적용
      const params = {
        keyword: '',
        searchTitle: searchOptions.searchTitle,
        searchContent: searchOptions.searchContent,
        searchTag: searchOptions.searchTag,
        currentUserOnly: searchOptions.currentUserOnly,
      };

      // 쿼리 스트링으로 변환
      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&');

      const response = await api.get(`/diaries/search?${queryString}`);

      // 전체 응답을 저장 (data 속성 자체가 DiaryList에 필요)
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setDiaryData(response.data);
      } else {
        console.error('응답 데이터가 예상된 형식이 아닙니다:', response);
        setDiaryData({
          timestamp: '',
          status: 200,
          message: '',
          data: []
        });
      }
    } catch (error) {
      console.error(error, '목록을 불러오는데 에러가 발생하였습니다.');
      setDiaryData({
        timestamp: '',
        status: 500,
        message: '에러가 발생했습니다',
        data: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // API 문서에 따른 파라미터 형식으로 변경
      const params = {
        keyword: searchTerm,
        searchTitle: searchOptions.searchTitle,
        searchContent: searchOptions.searchContent,
        searchTag: searchOptions.searchTag,
        currentUserOnly: searchOptions.currentUserOnly,
      };

      // 쿼리 스트링으로 변환
      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&');

      const response = await api.get(`/diaries/search?${queryString}`);

      // 전체 응답을 저장
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setDiaryData(response.data);
      } else {
        console.error('응답 데이터가 예상된 형식이 아닙니다:', response);
        setDiaryData({
          timestamp: '',
          status: 200,
          message: '',
          data: []
        });
      }
    } catch (error) {
      console.error(error, '검색 중 에러가 발생하였습니다.');
      setDiaryData({
        timestamp: '',
        status: 500,
        message: '에러가 발생했습니다',
        data: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (option) => {
    setSearchOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-5 w-full justify-center">
        <input
          type="text"
          placeholder="검색어를 입력해 주세요"
          className="text-[16px] border-b border-white p-1 basis-63/100 placeholder:text-[#FFFFFF]/70 text-white outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="bg-[#545454] text-white rounded px-3 w-20 text-base cursor-pointer hover:bg-neutral-400"
          onClick={handleSearch}>
          검색
        </button>
      </div>
      {/*체크 박스 시작 */}
      <div className="flex gap-4 w-full justify-start pl-30 text-[15px]">
        <div className="flex gap-1.5 items-center">
          <label className="cont">
            <input
              type="checkbox"
              checked={searchOptions.currentUserOnly}
              onChange={() => handleCheckboxChange('currentUserOnly')}
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
              checked={searchOptions.searchTitle}
              onChange={() => handleCheckboxChange('searchTitle')}
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
              checked={searchOptions.searchContent}
              onChange={() => handleCheckboxChange('searchContent')}
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
              checked={searchOptions.searchTag}
              onChange={() => handleCheckboxChange('searchTag')}
              value="태그"
            />
            <span></span>
          </label>
          <p className="text-white">태그</p>
        </div>
      </div>
      {/*체크 박스 끝 */}
      {/* 검색 결과 보이는 부분 */}
      <div className="w-full h-[350px] overflow-y-auto pr-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-white">로딩 중...</p>
          </div>
        ) : diaryData.data && diaryData.data.length > 0 ? (
          <DiaryList data={diaryData} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-white">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiarySearch;