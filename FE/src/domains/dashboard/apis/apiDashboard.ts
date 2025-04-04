import api from "@/apis/apiClient"

export interface EmotionCountItem {
    emotion: string;
    count: number;
  }


export interface DashboardEmotionData {
  periodDays: number;
  data: EmotionCountItem[];
}

export interface EmotionDataResponse {
    data: DashboardEmotionData;
}

export const EmotionDataApi = {

    // 14일 통계
    getFourteenEmotionsData: async(): Promise<EmotionDataResponse | null> => {
        try{
            const response = await api.get(`/diaries/emotions/statistics/two-weeks`)
            console.log("14일", response.data)
            return response.data
        }catch(error){
            console.error("❌ 14일 데이터 불러오기 오류", error)
            return null
        }
    },
    
    
    // 한 달 통계
    getThirteenEmotionData:  async() : Promise<EmotionDataResponse | null>=>{
        try{
            const response = await api.get(`/diaries/emotions/statistics/month`)
            console.log("30일", response.data)
            return response.data
        }catch(error){
            console.error("❌ 30일 데이터 불러오기 오류", error)
            return null
        }
    }


}














