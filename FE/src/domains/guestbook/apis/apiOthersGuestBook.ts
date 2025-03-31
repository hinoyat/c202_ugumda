import api from "@/apis/apiClient"

// others
// 방명록 생성 
// 방명록 서버 응답 타입
interface createGuestbookdata {
    "guestbookSeq": number,
    "ownerSeq": number,
    "writerSeq": number,
    "content": string,
    "createdAt": string,
    "updatedAt": string,
    "deletedAt": null,
    "isDeleted": string
}

interface createGuestbookRequest {
    "content": string
}

export const GuestbookOtherapi = {

    
    // 방명록 생성(다른사람페이지)  
    const createGuestbookEntry: async(data: createGuestbookRequest)=>{
        try{
            const response = await api.post(`/guestbook/users/${ownerSeq}`, data)
            return response.data
        }catch(error){
            console.error(error)
        }
    }

    
    // 방명록 조회(다른사람페이지)
    const getGuestbookEntries = async()=>{

    };

    // 방명록 삭제(다른사람페이지)
    const deleteGuestbookEntry = async()=>{

    };


}











