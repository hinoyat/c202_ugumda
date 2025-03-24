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
    """다음의 한국어 꿈일기 텍스트를 분석하여 핵심 키워드를 추출하고, 해당 키워드를 영어로 번역해주세요. 이 결과는 후속 text-to-image 모델과 text-to-video 모델의 프롬프트로 사용됩니다.

[작업 지시]
1. 입력된 꿈일기 텍스트를 주의 깊게 읽고, 텍스트의 주요 이미지를 형성하는 핵심 키워드를 선정합니다.
2. 선정 기준은 꿈에서 자주 등장하거나 감정, 분위기, 상징 등이 잘 드러나는 단어들입니다.
3. 불필요한 부가 설명이나 감정 표현은 제외하고, 핵심적인 명사 및 짧은 구문으로만 구성하세요.
4. 선정된 키워드를 한글로 요약한 후, 같은 키워드를 영어로 번역합니다.
5. 번역은 자연스러운 표현과 텍스트-투-이미지 모델과 텍스트-투-비디오 모델이 이해하기 쉬운 단어로 선택해주세요.

### 입력 텍스트:
{text}

### 출력 형식:
한국어 요약: [예: 꿈, 비행, 추격, 신비]
영어 번역: [예: dream, flight, chase, mysterious]
"""
)

# 출력을 문자열로 파싱
parser = StrOutputParser()

# 체인 구성
chain = prompt | llm | parser

