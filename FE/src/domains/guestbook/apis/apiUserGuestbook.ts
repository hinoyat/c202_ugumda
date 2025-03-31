import api from "@/apis/apiClient"

interface UserGuestbookResponse {

    "writerSeq": number,
    "writerNickname": string,
    "writerIconSeq": number,
    "content": string,
    "createdAt": string,
    "updatedAt": string
}


// 내 방명록 조회
export const getMyGuestbookEntries = async (): Promise<UserGuestbookResponse[] | null> => {
    try {
        const response = await api.get<UserGuestbookResponse[]>('/guestbook/me')
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error("내 방명록 조회 오류", error)
        return null
    }
}




