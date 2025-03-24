import app.core.chains as chain


def chat_gpt(content:str):
    '''
    :param content: 사용자가 입력한 꿈일기 텍스트
    :return prompt: chatgpt가 만든 키워드 번역 프롬프트
    '''
    prompt = chain.prompt_chain.invoke(content)
    # log 찍기
    return prompt


