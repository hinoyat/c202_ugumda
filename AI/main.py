from fastapi import FastAPI, BackgroundTasks, Header
from app.models.request.generate_chat_request_dto import GenerateVideoRequestDto
from app.models.response.video_generate_response_dto import VideoGenerateResponseDto
from app.core.generate_video import generate_video
from app.core.test_logic import test_logic_1
from app.log_config import logging_check
import logging

logging_check()

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
async def create_video(generate_chat_request_dto:GenerateVideoRequestDto, background_tasks:BackgroundTasks, authorization: str = Header(None)):
    logging.info(f"일기 내용 받기 성공, dairy_pk: {generate_chat_request_dto.diary_pk}")
    # 백그라운드 테스크로 추가할 함수
    background_tasks.add_task(
        generate_video,
        content=generate_chat_request_dto.content.replace('"', '\"').replace('\\', '\\\\'),
        diary_pk=generate_chat_request_dto.diary_pk,
        token=authorization,
    )

    # 프론트에 위 함수실행과 별개로 전달할 메세지
    response = VideoGenerateResponseDto(
        message="일기 생성 요청을 성공적으로 받았습니다.",
        diary_pk=generate_chat_request_dto.diary_pk
    )

    return response

# 현호야 이거로 테스트해!!
# url만 보내기
@app.post("/ai/test-sample-video")
async def sample_video(generate_chat_request_dto:GenerateVideoRequestDto, background_tasks:BackgroundTasks, authorization: str = Header(None)):
    logging.info(f"일기 내용 받기 성공, dairy_pk: {generate_chat_request_dto.diary_pk}")
    background_tasks.add_task(
        test_logic_1,
        content=generate_chat_request_dto.content,
        diary_pk=generate_chat_request_dto.diary_pk,
        token=authorization,
    )

    # 포스트맨에 뜨는 메세지(원래는 프론트에 보내짐)
    response = VideoGenerateResponseDto(
        message="일기 생성 요청을 성공적으로 받았습니다.",
        diary_pk=generate_chat_request_dto.diary_pk
    )

    return response