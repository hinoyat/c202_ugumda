import api from "@/apis/apiClient"

// others
// 방명록 서버 응답 타입
export interface Guestbookdata {
    "guestbookSeq": number,
    "ownerSeq":number,
    "writerSeq": number,
    "writerNickname": string,
    "writerIconSeq": number,
    "content": string,
    "createdAt": string,
    "updatedAt": string,
    "deletedAt": null,
    "isDeleted": "N"
}

// 방명록 생성 요청 타입
export interface CreateGuestbookRequest {
    content: string
}

export const GuestbookOtherapi = {

    // 방명록 조회(다른사람페이지)
    getGuestbookEntries: async(PageUserNumber:number): Promise<Guestbookdata[] |null> => {
        try{
            const response = await api.get(`/guestbook/users/${PageUserNumber}`)
            return response.data
        }catch(error){
            console.error("❌ 다른사람 방명록 조회 오류", error)
            return null
        }
    },
    
    // 방명록 생성(다른사람페이지)  
    createGuestbookEntry: async(ownerSeq: number, content:string): Promise<Guestbookdata |null>=>{
        
        try{
            const response = await api.post(`/guestbook/users/${ownerSeq}`, {content})
            return response.data
        }catch(error){
            console.error("❌ 방명록 생성 오류:", error)
            return null
        }
    },
    


    // 방명록 삭제
    deleteGuestbookEntry:  async(guestbookSeq:number) : Promise<any>=>{
        try{
            const response = await api.delete(`/guestbook/${guestbookSeq}`)
            return response.data
        }catch(error){
            console.error("❌ 방명록 삭제 오류", error)
        }
    }


}














