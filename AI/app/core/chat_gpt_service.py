from openai import api_key

import app.core.chains as chain
import logging
import re
from app.log_config import logging_check

logging_check()

def chat_gpt(content:str):
    '''
    :param content: 사용자가 입력한 꿈일기 텍스트
    :return prompt: chatgpt가 만든 키워드 번역 프롬프트
    '''
    logging.info("함수시작")

    full_prompt = chain.prompt_chain.invoke(content)
    logging.info(f"전체 프롬프트: {full_prompt}")

    # 영어 번역 부분만 출력
    try:
        match = re.search(r"영어\s*번역:\s*\[([^\]]+)\]", full_prompt)
        if match:
            keywords_str = match.group(1)   # 쉼표로 분리
            keywords = [keyword.strip() for keyword in keywords_str.split(",")]  # 공백 제거
            prompt = ",".join(keywords)
            logging.info(f"추출된 prompt: {prompt}")
        else:
            print("'영어번역:' 패턴을 찾을 수 없습니다.")
            print("대신 다음 키워드를 사용합니다: 'dreamlike, mystery, fantasy, surreal'")
            prompt = "dreamlike, mystery, fantasy, surreal"
    except Exception as e:
        print(f"오류 발생: {e}")
        prompt = "dreamlike, mystery, fantasy, surreal"  # 폴백 키워드

    logging.info(f"Generated prompt: {prompt}")
    return prompt

