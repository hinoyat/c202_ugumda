from fastapi import FastAPI
from .models.request.generate_chat_request_dto import GenerateChatRequestDto
from app.core.chat_gpt_service import chat_gpt


# main.py가 있는 디렉토리에서 아래 명령어 실행
# uvicorn main:app --reload --port=8000
'''
>> main : main.py의 main
>> app : main.py안에 있는 app=FastAPI()
>> --reload : 코드 변경 시 자동으로 저장되어 재시작됨
>> --host : 모든 접근이 가능하게 하려면 0.0.0.0을 입력한다 (선택사항)
>> --port : 접속 원하는 포트를 지정해 준다 (선택사항)
'''



app = FastAPI()


@app.get("/")
async def root():
    return {"message": "채현채현"}


'''
1. chat api 가져와서 프롬프트 생성 (키워드추출, 필터링)
2. video 생성
'''

@app.post("/ai/create-video")
async def create_image(generate_chat_request_dto:GenerateChatRequestDto):
    task_result = chat_gpt(
        prompt_text=generate_chat_request_dto.content
    )
    return {
        "status": task_result.status,
        "message": task_result
    }
