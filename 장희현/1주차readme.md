<details>
<summary><b>2025-03-04</b></summary>

백과 프론트가 어떻게 데이터를 주고 받는지 공부하는 중.

백에서 인증 설정하는 것을 배웠음.

Basic Authentication, Bearer Token Authentication, JWT, OAuth에 대해 배울 수 있었음.

백에서 어떤 식으로 설계하는지

springboot는 어떻게 사용되는지 실습을 통해서 경험해 볼 수 있었음!

1학기에는 완성된 api를 사용했기 때문에 api가 잘못 보내질 수도 있다는 생각을 못했어서
<br> 첫 번째 프로젝트에서 백엔드와 소통하며 문제를 해결하는데 어려움이 있었는데
<br> 그 부분에 대해서 궁금증이 해소되었음.

</details>

<details>
<summary><b>2025-03-05</b></summary>

인증 관련해서 추가로 정보를 찾아봄.

<details>
<summary><strong> Basic Authentication과 JWT 인증의 차이 </strong></summary>

1. **인증 방식**

   - **Basic Authentication**: 매 요청마다 사용자 ID와 비밀번호를 전송
   - **JWT**: 최초 로그인 후 발급받은 토큰을 전송

2. **상태 관리**

   - **Basic Authentication**: 서버가 사용자 상태를 기억하지 않음 (Stateless)
   - **JWT**: 마찬가지로 상태를 기억하지 않지만, 토큰 자체에 필요한 정보를 포함

3. **보안성**

   - **Basic Authentication**: 비밀번호가 매번 전송되므로 보안 위험이 높음
   - **JWT**: 비밀번호는 최초 로그인시에만 전송

4. **만료와 갱신**

   - **Basic Authentication**: 만료 개념이 없음
   - **JWT**: 토큰에 만료 시간을 설정할 수 있음

==> Basic Authentication은 은행 ATM처럼 돈을 인출할 때마다 카드, 비밀번호를 모두 입력해야 함. 다른 ATM을 사용하거나 같은 ATM을 다시 사용하더라도 매번 입력해야 함. 즉, 일회성 접근임.거래가 완료되면 인증도 끝남.

그렇기 때문에 매번 비밀번호를 입력해야 하므로 번거롭고, 비밀번호 노출위험이 높다는 단점이 있음.

반면 JWT는 호텔의 키처럼 발급받은 키카드를 계속 사용하는 방식. 그렇기 때문에 보안성과 사용자 경험 측면에서 더 선호됨.

   </details>

</details>

<details>
<summary><b>2025-03-06</b></summary>

피그잼 사용법을 배워서 와이어 프레임을 만들었음.

component 단위로 묶어서 피그마를 사용할 수 있다는 것을 배웠음.

공통 컴포넌트, 컴포넌트 만들때 도움이 될 것 같음.

</details>

<details>
<summary><b>2025-03-07</b></summary>
피그마 목업 제작을 시작함.

기능 명세서와 와이어 프레임이 중요하다는 것을 느꼈음.

팀원들이 꼼꼼하게 문서를 작성해줘서 피그마 제작 속도를 낼 수 있었음!!

목업으로 화면을 구성하다보니 놓쳤던 부분들을 추가할 수 있어서
<br> 목업이 단순히 디자인을 위한 것이 아니라는 것을 경험할 수 있었음.

</details>
