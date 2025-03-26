import app.core.chat_gpt_service as text
import app.core.chat_stability_service as image
import app.core.chat_runway_service as video
from app.log_config import logging_check
import logging

logging_check()

def generate_video(content:str):
    logging.info("시작")
    prompt = text.chat_gpt(content)

    logging.info("프롬프트 완료")
    image_base64 = image.stability(prompt)

    logging.info("이미지 완료")
    video_url = video.runway(image_base64, prompt)

    # return 값은 확인할 필요 없음
    return video_url


'''
비동기함수 프론트에 전해주기 위해 만들었음
위에 코드는 포스트맨 확인용(지우기)
'''


