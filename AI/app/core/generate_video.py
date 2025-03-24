import app.core.chat_gpt_service as text
import app.core.chat_stability_service as image
import app.core.chat_runway_service as video

def generate_video(content:str):
    prompt = text.chat_gpt(content)
    # 로그 찍기
    image_base64 = image.stability(prompt)
    video_url = video.runway(image_base64, prompt)

    # s3 저장을 하고

    # 백엔드 s3 저장 위치 url을 주고


    # return 값은 확인할 필요 없음
    return video_url


'''
비동기함수 프론트에 전해주기 위해 만들었음
위에 코드는 포스트맨 확인용(지우기)
'''
# async def generate_video(content:str):
#     prompt = text.chat_gpt(content)
#     # 로그 찍기
#     image_base64 = image.stability(prompt)
#     video_url = video.runway(image_base64, prompt)
#
#     # s3 저장을 하고
#
#     # 백엔드 s3 저장 위치 url을 주고
#
#
#     # return 값은 확인할 필요 없음
#     return video_url


