from langchain_core.prompts import ChatPromptTemplate  # 챗봇 형식의 프롬프트 템플릿을 생성하는 클래스
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser  # 모델의 출력을 단순 문자열로 파싱하는 클래스


# 객체 생성
llm = ChatOpenAI(
    temperature=0.1,  # 창의성 (0.0 ~ 2.0)
    model_name="gpt-3.5-turbo",  # 모델명
)

# 요약 및 번역을 동시에 수행하는 프롬프트 템플릿
prompt = ChatPromptTemplate.from_template(
    """다음 한국어 텍스트를 먼저 핵심 내용만 간결하게 요약한 후, 
    그 요약된 내용을 영어로 번역해주세요.

    ### 입력 텍스트:
    {text}

    ### 출력 형식:
    한국어 요약: [요약된 내용]
    영어 번역: [영어로 번역된 요약]
    """
)

# 출력을 문자열로 파싱
parser = StrOutputParser()

# 체인 구성
chain = prompt | llm | parser


# 사용 예시
def process_text(input_text):
    result = chain.invoke({"text": input_text})
    return result


# 실행 예시
input_text = "여기에 요약하고 번역할 한국어 텍스트를 입력하세요..."
output = process_text(input_text)
print(output)