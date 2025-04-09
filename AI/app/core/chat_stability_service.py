from dotenv import load_dotenv
import logging
from app.log_config import logging_check
import requests
import os

logging_check()
load_dotenv()

def stability(prompt:str):
    api_key = os.getenv("STABILITY_API_KEY")
    response = requests.post(
        f"https://api.stability.ai/v2beta/stable-image/generate/sd3",

        headers={
            "authorization": f"Bearer {api_key}",
            "accept": "application/json"
        },
        files={"none": ''},
        data={
            "prompt": {prompt},
            "output_format": "png",
        },
    )

    logging.info("이미지 생성완료")

    if response.status_code == 200:
        logging.info(f"응답 시작 부분: {str(response.content[:30])}")
        logging.info(f"응답 Content-Type: {response.headers.get('Content-Type')}")
        img_length = len(response.content)
        logging.info(f"이미지64 길이:{img_length}")

        response_json = response.json()
        base64_image = response_json["image"]


        # 여기서부터 추가
        # base64 디코딩
        import base64
        import uuid

        # 디코딩하여 바이너리 데이터로 변환
        image_data = base64.b64decode(base64_image)

        # 파일 이름 생성 (UUID 사용하여 고유한 이름 생성)
        file_name = f"{uuid.uuid4()}.png"

        # 저장 경로
        save_path = f"AI/src/{file_name}"

        # 디렉토리가 없으면 생성
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # 파일로 저장
        with open(save_path, "wb") as file:
            file.write(image_data)

        logging.info(f"이미지가 {save_path}에 저장되었습니다.")


        return base64_image
    else:
        raise Exception(str(response.json()))
