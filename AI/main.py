from fastapi import FastAPI
from app.models.request.generate_chat_request_dto import GenerateChatRequestDto
from app.core.generate_video import generate_video


'''
>> main : main.py의 main
        # main.py가 있는 디렉토리에서 아래 명령어 실행
        # uvicorn main:app --reload --port=8000
>> app : main.py안에 있는 app=FastAPI()
>> --reload : 코드 변경 시 자동으로 저장되어 재시작됨
>> --host : 모든 접근이 가능하게 하려면 0.0.0.0을 입력한다 (선택사항)
>> --port : 접속 원하는 포트를 지정해 준다 (선택사항)
'''
app = FastAPI()

'''
1. chat api 가져와서 프롬프트 생성 (키워드추출, 필터링)
2. image 생성
3. video 생성

'''

'''
추가 수정 사항: 
1. return 값 변경 프론트에 보낼 responsedto 만들기
2. 백에 보낼 
'''

@app.post("/ai/create-video")
async def create_video(generate_chat_request_dto:GenerateChatRequestDto):
    result = generate_video(
        content=generate_chat_request_dto.content.replace('"','\"').replace('\\','\\\\')
    )
    return {
        "message": result
    }
    




