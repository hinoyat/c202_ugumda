import React, { useEffect, useState } from 'react';
import DashboardLine from './DashboardLine';
import GgumGraph from './GgumGraph';
import { EmotionDataApi, EmotionDataResponse } from '../apis/apiDashboard';


const GraphSection = () => {

  const [twoWeeksData, setTwoWeeksData] = useState<EmotionDataResponse | null>(null);
  const [monthlyData, setMonthlyData] = useState<EmotionDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 14일 데이터 가져오기
        const twoWeeksResult = await EmotionDataApi.getFourteenEmotionsData();
        // console.log("이주데이터 보냄", twoWeeksResult?.data.data)
        setTwoWeeksData(twoWeeksResult.data);
        
        // 30일 데이터 가져오기
        const monthlyResult = await EmotionDataApi.getThirteenEmotionData();
        console.log("30일데이터 보냄", monthlyResult?.data.data)
        setMonthlyData(monthlyResult.data);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error('데이터 불러오기 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
            <div className="flex flex-col gap-10">
            <div className="flex flex-col">
                <GgumGraph 
                    periodName={twoWeeksData?.data?.periodDays || 14}  
                    height="55%"
                    data={twoWeeksData?.data || []}
                     />
            </div>
            <div className="flex flex-col">
                <GgumGraph 
                    periodName={twoWeeksData?.data?.periodDays || 30}  
                    height="55%"
                    data={monthlyData?.data || []}
                     />
            </div>
          </div> 
  );
};

export default GraphSection;
