# 🤩 꿈을 우주의 별로 기록하고 AI 영상으로 보여주는 우꿈다 서비스

![main](./readme/home.png)

- 배포 URL : https://j12c202.p.ssafy.io/

<br>

## 프로젝트 소개

- 꿈을 우주의 별로 기록하고, 꿈 내용을 바탕으로 AI영상을 생성하여 즐거움을 주는 서비스입니다.

<br>

## 팀원 구성

<div align="center">

|                                     **강현호**                                     |                                     **정현수**                                      |                                     **박주찬**                                      |                                     **장희현**                                      |                                     **임채현**                                      |                                     **김서린**                                      |
| :--------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: |
| <img src="FE/src/assets/profile-icon/icon1.svg" width="100" alt="프로필 아이콘" /> | <img src="FE\src\assets\profile-icon\icon10.svg" width="100" alt="프로필 아이콘" /> | <img src="FE\src\assets\profile-icon\icon50.svg" width="100" alt="프로필 아이콘" /> | <img src="FE\src\assets\profile-icon\icon12.svg" width="100" alt="프로필 아이콘" /> | <img src="FE\src\assets\profile-icon\icon19.svg" width="100" alt="프로필 아이콘" /> | <img src="FE\src\assets\profile-icon\icon40.svg" width="100" alt="프로필 아이콘" /> |

</div>

<br>

## 1. 개발 환경

- Front :
- Back-end :
- 버전 및 이슈관리 :
- 협업 툴 :
- 서비스 배포 환경 :
- 디자인 :

<br>

## 2. 채택한 개발 기술과 브랜치 전략

### React

-
-

### three.js

-
-

### Spring

-
- 백엔드 더 추가해주세요!

### SSE

-
-

### 브랜치 전략

- Git-flow 전략에서 주요 통합은 dev 브랜치에서 관리했습니다.
- dev 브랜치는 실제 개발의 메인 브랜치로 활용되며, 모든 기능 개발 및 급한 수정(Hotfix) 사항을 통합&테스트 했습니다.
- feature 브랜치는 개별 기능이나 개선 사항을 독립적으로 작업하기 위해 사용했습니다.
- 브랜치 이름은 feature/ 뒤에 작업 도메인(예: FE, AI, BE, INFRA)와 기능 설명, 그리고 뒤에 JIRA 티켓 번호를 붙이는 형식으로 관리합니다.
- TIL 브랜치는 개발 중 배운 내용이나 경험을 정리하는 용도로 운영했습니다.

```
master
└── dev
       ├── feature/AI
       │   └── feature/AI-video-creat/123
       ├── feature/BE
       │   ├── feature/BE-auth-api/124
       │   └── feature/BE-logging/125
       ├── feature/FE
       │   ├── feature/FE-login-page/126
       │   └── feature/FE-user-profile/127
       └── hotfix/login-bugfix

```

<br>

## 3. 프로젝트 구조

```
woo-ggum-da/
├── frontend/
│   ├── .eslint.js
│   ├── .prettierrc
│   ├── tsconfig.json
│   ├── package-lock.json
│   ├── package.json
│   ├── index.html
│   ├── public/
│   │   ├── 3d_component.gtlf
│   │   └── 3d_component.fbx
│   └── src/
│       ├── components/         # 공통 UI 컴포넌트
│       ├── hooks/              # 공통 React 훅
│       ├── stores/             # 글로벌 Redux 상태 관리
│       ├── routers/            # 글로벌 라우팅 설정
│       ├── apis/               # API 관련 코드
│       ├── themes/             # 스타일/테마 관련 파일
│       ├── types/              # 타입 파일
│       ├── domains/
│       │   ├── 기능1 (ex. Login)/
│       │   │   ├── components/
│       │   │   ├── pages/      # 보이는 페이지
│       │   │   ├── hooks/
│       │   │   ├── stores/
│       │   │   ├── apis/       # API 관련 코드
│       │   │   └── themes/
│       │   └── 기능2 (ex. SignUp)/
│       ├── config.ts           # 환경 변수 및 설정
│       ├── App.tsx             # 앱 루트
│       ├── main.tsx            # React 엔트리 포인트
│       ├── .prettierrc
│       ├── eslint.config.js
│       ├── tailwind.config.js
│       ├── vite.config.js
│       ├── jsconfig.json
│       └── index.css           # 글로벌 스타일
│
├── backend/                    # 현호오빠 취합
│   ├── package.json
│   ├── src/
│   └── config/
│
├── AI/
│   ├── app/
│   │   ├── config/
│   │   ├── core/               # chain, 프롬프트
│   │   └── models/             # DTO
│   │       ├── request/
│   │       └── response/
│   └── main.py

...
```

<br>

## 4. 프로젝트 아키텍쳐

<img src="아키텍쳐 이미지 추가해주세요!" width="100%" height="100%"/>

## 5. 역할 분담

### 🍜강현호

- **Backend**
  - 아래는 예시입니다! 적어주세요
  - STOMP websocket 통신 구현
  - 데이터 분석 및 인사이트 도출
  -

<br>

### 🍖정현수

- **Backend**
  - ERD 설계 및 데이터 모델링
  -
  -
  -

<br>

### 🍶박주찬

- **CI/CD, Frontend**
  - 배포 서버 인프라 구축
  -
  -

<br>

### 🍪장희현

- **Frontend**
  - 메인 페이지 UI/UX 구현
  -
  -

<br>

### 🎂임채현

- ## **AI, Frontend**
  -
  -

<br>

### 🍚김서린

- ## **AI, Frontend**
  -
  -

<br>

## 6. 개발 기간 및 작업 관리

### 개발 기간

- 전체 개발 기간 : 2025-02-24 ~ 2025-04-11
- 아이디어 기획 : 2025-02-24 ~ 2025-02-28
- UI 구현 : 2025-03-07 ~ 2025-03-21
- 기능 구현 : 2025-03-17 ~ 2025-04-11

<br>

### 작업 관리

-
-

<br>

## 7. 신경 쓴 부분

- 별자리 부분

-

<br>

## 7. 페이지별 기능

### [히어로 페이지]

- 아래 이미지는 다 GIF 넣어주시면 감사하겠습니다.

| 히어로 페이지                                                                             |
| ----------------------------------------------------------------------------------------- |
| ![login](https://github.com/user-attachments/assets/3baf1cae-fc3f-403c-99b8-f3d40b3c417f) |

<br>

### [로그인/회원가입 페이지 ]

-

| 로그인/ 회원가입 페이지                                                                             |
| --------------------------------------------------------------------------------------------------- |
| ![consultant_main](https://github.com/user-attachments/assets/160820e2-c073-4c3f-b645-6df6d5772164) |

<br>

### [메인페이지]

-

| 메인 별자리 페이지                                                                                      |
| ------------------------------------------------------------------------------------------------------- |
| ![consultant_children](https://github.com/user-attachments/assets/8b0268cf-0e6c-43c0-ab4c-1a1888267198) |

<br>

### [일기(별자리) 모달]

-

| 일기 AI영상, 꿈일기, 꿈 해몽 보기                                                                    |
| ---------------------------------------------------------------------------------------------------- |
| ![consultant_schdl](https://github.com/user-attachments/assets/33595f8f-5b29-45a9-ae71-20f249208064) |

| 일기 작성하기                                                                                        |
| ---------------------------------------------------------------------------------------------------- |
| ![consultant_schdl](https://github.com/user-attachments/assets/33595f8f-5b29-45a9-ae71-20f249208064) |

<br>

### [우주선 페이지]

-

| 우주선 행운번호 뽑기, 꿈 대시보드, 오늘의 운세로 이동 페이지                                     |
| ------------------------------------------------------------------------------------------------ |
| ![parent_schdl](https://github.com/user-attachments/assets/e2534b8e-818d-44f4-bac8-0502970ebe49) |

<br>

### [꿈 대시보드]

-

| 꿈 대시보드 페이지                                                                             |
| ---------------------------------------------------------------------------------------------- |
| ![child_page](https://github.com/user-attachments/assets/762e05b1-fadc-4a26-a665-d09f0881c6a6) |

<br>

### [행운번호 뽑기 페이지]

-

| 행운번호 뽑기 페이지          |
| ----------------------------- |
| ![child_game](./img/game.gif) |

<br>

### [오늘의 운세 페이지]

-

| 오늘의 운세 페이지              |
| ------------------------------- |
| ![child_study](./img/study.gif) |

<br>

### [방명록 모달]

-

| 방명록 모달                             |
| --------------------------------------- |
| ![card_chatbot](./img/card_chatbot.gif) |

<br>

### [검색 모달]

-

| 유저검색 모달                           |
| --------------------------------------- |
| ![card_chatbot](./img/card_chatbot.gif) |

| 일기검색 모달                           |
| --------------------------------------- |
| ![card_chatbot](./img/card_chatbot.gif) |

<br>

### [블랙홀]

-

| 블랙홀 페이지                                                                             |
| ----------------------------------------------------------------------------------------- |
| ![board](https://github.com/user-attachments/assets/41abc817-0dbe-4842-944c-a0a89da7ec44) |

<br>

![main](./readme/home_last.png)
