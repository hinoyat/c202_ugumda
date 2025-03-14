// 일기 데이터 모델

export interface Position {
  x: number;
  y: number;
  z: number;
}

class DiaryEntry {
  id: string;
  content: string;
  date: Date;
  position: Position;
  size: number;
  color: string;

  constructor(
    id: string,
    content: string,
    date: Date,
    position: Position | null = null
  ) {
    this.id = id;
    this.content = content;
    this.date = date;

    if (!position) {
      this.position = DiaryEntry.generateRandomSpherePosition(100);
    } else {
      this.position = position;
    }

    this.size = 2;
    this.color = DiaryEntry.getRandomColor();
  }

  static generateRandomSpherePosition(radius: number): Position {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return { x, y, z };
  }

  static getRandomColor(): string {
    const colors = [
      '#FFFFFF', // 흰색
      '#FFFACD', // 밝은 노란색
      '#ADD8E6', // 밝은 파란색
      '#FFB6C1', // 분홍색
      '#FFA07A', // 연한 주황색
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export default DiaryEntry;
