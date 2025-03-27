// // 일기 데이터 모델
// // 입력된 데이터를 시스템에 저장하는 로직 처리
// // DiaryComponent는 입력을, addEntry는 저장을 담당

// import { dummyDiaries } from '@/data/dummyDiaries';

// // 별 생성할 위치 (백에서 보내줄 것임)
// export interface Position {
//   x: number;
//   y: number;
//   z: number;
// }

// // 백엔드 api 요청을 위한 인터페이스
// interface DiaryApiRequest {
//   title: string;
//   content: string;
//   dreamDate: string;
//   isPublic: string;
//   mainEmotion: string;
//   tags: string[];
// }

// class DiaryEntry {
//   diary_seq: number; // 일기 고유번호(PK)
//   user_seq: number; // 회원번호(FK)
//   title: string; // 제목
//   content: string; // 내용
//   video_url: string | null; // 비디오 URL
//   dream_date: string; // 꿈꾼날 (YYYYMMDD 형식)
//   created_at: string; // 생성일 (YYYYMMDDHHmmss 형식)
//   updated_at: string; // 수정일 (YYYYMMDDHHmmss 형식)
//   deleted_at: string | null; // 삭제일 (YYYYMMDDHHmmss 형식)
//   is_deleted: 'Y' | 'N'; // 삭제여부
//   is_public: 'Y' | 'N'; // 공개여부

//   // UI 관련 추가 속성
//   position: Position;
//   tags: string[];
//   size: number; // 별의 크기 추가

//   constructor(
//     // 일기 생성에 필요한 것들
//     params: {
//       user_seq: number;
//       title: string;
//       content: string;
//       video_url?: string | null;
//       dream_date?: string;
//       tags?: string[];
//       is_public?: 'Y' | 'N' | boolean; // 변경: boolean 타입도 허용하도록 수정
//       position?: Position; // 지정하지 않으면 랜덤 생성
//       size?: number; // 별 크기
//       color?: string; // 별 색상
//     }
//   ) {
//     // 고유 ID로 현재 timestamp 사용 (임시)
//     // 실제 구현에서는 DB에서 자동 생성될 것임
//     this.diary_seq = Date.now();

//     this.user_seq = params.user_seq;
//     this.title = params.title;
//     this.content = params.content;
//     this.video_url = params.video_url || null;

//     // dream_date가 제공되지 않았으면 오늘 날짜로 설정 (YYYYMMDD 형식)
//     const today = new Date();
//     this.dream_date =
//       params.dream_date ||
//       `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

//     // 현재 시간을 YYYYMMDDHHmmss 형식으로 변환
//     const now = new Date();
//     const formattedNow = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

//     this.created_at = formattedNow;
//     this.updated_at = formattedNow;
//     this.deleted_at = null;
//     this.is_deleted = 'N';

//     // 변경: 불리언을 'Y'/'N'으로 변환하는 로직 추가
//     if (typeof params.is_public === 'boolean') {
//       this.is_public = params.is_public ? 'Y' : 'N';
//     } else {
//       this.is_public = params.is_public ?? 'Y';
//     }

//     // UI 관련 속성
//     this.tags = params.tags || [];
//     this.position =
//       params.position || DiaryEntry.generateRandomSpherePosition(100);

//     // 별 크기 설정 (기본값: 1)
//     this.size = params.size || 1;
//   }

//   // 구 표면 위의 랜덤 위치 생성 정적 메서드
//   // 균일한 분포로 3D 공간에 위치 생성
//   static generateRandomSpherePosition(radius: number): Position {
//     const u = Math.random();
//     const v = Math.random();
//     const theta = 2 * Math.PI * u;
//     const phi = Math.acos(2 * v - 1);

//     // 반경에 약간의 변동 추가 (±10%)
//     const randomizedRadius = radius * (0.9 + Math.random() * 0.2);

//     const x = radius * Math.sin(phi) * Math.cos(theta);
//     const y = radius * Math.sin(phi) * Math.sin(theta);
//     const z = radius * Math.cos(phi);

//     return { x, y, z };
//   }

//   // 일기를 삭제 상태로 표시
//   delete(): void {
//     const now = new Date();
//     const formattedNow = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

//     this.deleted_at = formattedNow;
//     this.is_deleted = 'Y';
//   }

//   // 일기 내용 업데이트
//   update(params: {
//     title?: string;
//     content?: string;
//     video_url?: string | null;
//     dream_date?: string;
//     is_public?: 'Y' | 'N' | boolean; // 변경: boolean 타입도 허용하도록 수정
//     tags?: string[];
//     size?: number;
//     color?: string;
//   }): void {
//     if (params.title !== undefined) this.title = params.title;
//     if (params.content !== undefined) this.content = params.content;
//     if (params.video_url !== undefined) this.video_url = params.video_url;
//     if (params.dream_date !== undefined) this.dream_date = params.dream_date;
//     if (params.tags !== undefined) this.tags = params.tags;
//     if (params.size !== undefined) this.size = params.size;

//     // 변경: is_public이 불리언인 경우 'Y'/'N'으로 변환
//     if (params.is_public !== undefined) {
//       if (typeof params.is_public === 'boolean') {
//         this.is_public = params.is_public ? 'Y' : 'N';
//       } else {
//         this.is_public = params.is_public;
//       }
//     }

//     // 수정 시간 업데이트
//     const now = new Date();
//     const formattedNow = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

//     this.updated_at = formattedNow;
//   }

//   // 새 DiaryEntry 인스턴스를 생성하는 팩토리 메서드
//   static create(params: {
//     user_seq: number;
//     title: string;
//     content: string;
//     video_url?: string | null;
//     dream_date?: string;
//     tags?: string[];
//     is_public?: 'Y' | 'N' | boolean; // 변경: boolean 타입도 허용하도록 수정
//     position?: Position;
//     size?: number;
//     color?: string;
//   }): DiaryEntry {
//     return new DiaryEntry(params);
//   }

//   // 목데이터에서 DiaryEntry 객체 생성
//   static fromDummyData(dummyData: any): DiaryEntry {
//     const entry = new DiaryEntry({
//       user_seq: dummyData.user_seq,
//       title: dummyData.title,
//       content: dummyData.content,
//       video_url: dummyData.video_url,
//       dream_date: dummyData.dream_date,
//       is_public: dummyData.is_public as 'Y' | 'N',
//     });

//     // 추가 속성 설정
//     entry.diary_seq = dummyData.diary_seq || entry.diary_seq;
//     entry.created_at = dummyData.created_at || entry.created_at;
//     entry.updated_at = dummyData.updated_at || entry.updated_at;
//     entry.deleted_at = dummyData.deleted_at || entry.deleted_at;
//     entry.is_deleted = dummyData.is_deleted || entry.is_deleted;

//     return entry;
//   }

//   // 추가: 불리언 형태로 is_public 값을 가져오는 getter 메서드
//   // 이렇게 하면 컴포넌트에서 일관되게 불리언 값으로 작업할 수 있습니다
//   get isPublic(): boolean {
//     return this.is_public === 'Y';
//   }

//   // 백엔드에 요청 보내는 메서드
//   toApiRequest(): DiaryApiRequest {
//     return {
//       title: this.title,
//       content: this.content,
//       dreamDate: this.dream_date,
//       isPublic: this.is_public,
//       mainEmotion: this.main_emotion,
//       tags: this.tags,
//     };
//   }
// }

// export default DiaryEntry;
