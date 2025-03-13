const DreamMeaningLog = () => {
  const meaningData = [
    { id: 1, title: '차를 타고 가는 꿈은 변화의 신호...' },
    { id: 2, title: '고양이는 자립과 자유를...' },
    { id: 3, title: '하늘을 나는 꿈은 기회의 시작' },
    { id: 4, title: '물속에서 헤엄치는 꿈은 감정의 변화...' },
    { id: 5, title: '빛나는 별은 희망을 상징...' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-[#6C4D2C] ml-10">DREAM MEANING LOG</h1>

      <div className="flex flex-col gap-1 ml-10 px-2">
        {meaningData.map((item) => (
          <div
            key={item.id}
            className="text-[12px]">
            <h2 className="text-white hover:underline cursor-pointer">
              {item.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DreamMeaningLog;
