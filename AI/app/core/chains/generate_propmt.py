from langchain_core.prompts import ChatPromptTemplate  # 챗봇 형식의 프롬프트 템플릿을 생성하는 클래스
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser  # 모델의 출력을 단순 문자열로 파싱하는 클래스
from dotenv import load_dotenv

load_dotenv()

# 객체 생성
llm = ChatOpenAI(
    temperature=0.1,  # 창의성 (0.0 ~ 2.0)
    model_name="gpt-3.5-turbo",  # 모델명
)

# 요약 및 번역을 동시에 수행하는 프롬프트 템플릿
prompt = ChatPromptTemplate.from_template(
    """
    다음의 한국어 꿈일기 텍스트를 분석하여 핵심 키워드를 최소 4개 이상 추출하고, 해당 키워드를 영어로 번역해주세요. 이 결과는 후속 text-to-image 모델과 text-to-video 모델의 프롬프트로 사용됩니다.

    [작업 지시]
    1. 입력된 꿈일기 텍스트를 주의 깊게 읽고, 텍스트의 주요 이미지를 형성하는 최소 4개 이상의 핵심키워드를 선정합니다.
    2. 선정 기준은 꿈에서 자주 등장하거나 감정, 분위기, 상징 등이 잘 드러나는 단어들입니다.
    3. 불필요한 부가 설명이나 감정 표현은 제외하고, 핵심적인 명사 및 짧은 구문으로만 구성하세요.
    4. 선정된 키워드를 한글로 요약한 후, 같은 키워드를 영어로 번역합니다.
    5. 번역은 자연스러운 표현과 텍스트-투-이미지 모델과 텍스트-투-비디오 모델이 이해하기 쉬운 단어로 선택해주세요.
    
     #### 입력 텍스트:  
    "꿈에 최예나가 나왔는데 나랑 친구였어. 예나랑 나랑 사이좋게 계란 까먹으려 하는데 잘 못 까길래 나 계란 짱 잘 까! 하고 잘 까진 거 건네주고 예나꺼 내가 받아서 까줬어."  

    #### 기존 출력 (X - 너무 정적임):  
    `[dream, friend, egg, share]`  

    #### 개선된 출력 (O - 더 동적이고 영상에 적합함):  
    `[cracking an egg, sharing, friendship, smiling]`  

    ---  

    ### 📌 **예시 2**  
    #### 입력 텍스트:  
    "나는 거대한 유령의 성에 갇혀 있었어. 복도를 따라 걸어가는데, 벽에 걸린 초상화가 나를 따라 보는 것 같았어. 갑자기 창문이 열리더니 바람이 거세게 불었고, 촛불이 모두 꺼졌어."  

    #### 기존 출력 (X - 너무 단순함):  
    `[ghost, castle, wind, painting]`  

    #### 개선된 출력 (O - 동적이고 감정 반영됨):  
    `[walking in a haunted castle, eerie wind, moving portraits, flickering candlelight]`  

    ---  

    ### 📌 **예시 3**  
    #### 입력 텍스트:  
    "모르는 사람의 집에 들어갔는데 집이 정말 예뻤어. 이불이 하나 놓여있어서 그걸 가지고 밖에 와서 강을 바라보며 의자에서 이불 덮고 잠을 잤어. 얼마나 잤을까? 주인이 돌아왔더라고. 근데 짐을 몰래 두고 갈까 하다가 들킬 것 같아서 그냥 죄송하다고 했어, 잘못했다고. 근데 그리고 집을 가는데 그 집이 자꾸 눈에 아른거려서 다시 갔어. 고양이마냥 천장으로 들어갔는데 들킬 것 같아 조마조마했지만, 집이 진짜 예뻐서 예쁘다는 생각을 했어. 그 집에는 고양이가 엄청 많더라. 엄청 귀엽고 예쁜 고양이들이 많이 있더라. 고양이들이 모르는 사람이 들어와서 그런지 나를 쳐다보더라. 그렇게 고양이와 집을 구경하고 나왔어"  

    #### 기존 출력 (X - 정적임):  
    `[house, blanket, cat, river]`  

    #### 개선된 출력 (O - 더 영상에 적합함):  
    `[sneaking into a beautiful house, warm blanket, sleeping by the river, feeling anxious, crawling like a cat, curious cats staring, exploring the house]`  

    ---  

    ### 입력 텍스트:  
    {text}  

    ### 출력 형식:  
    영어 번역: [핵심 키워드 1, 핵심 키워드 2, ..., 핵심 키워드 N]
    """
)

# 출력을 문자열로 파싱
parser = StrOutputParser()

# 체인 구성
chain = prompt | llm | parser

