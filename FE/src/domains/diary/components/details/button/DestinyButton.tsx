// 꿈해몽 결과에 따라 이동하는 버튼

import ButtonBase from '@/domains/diary/components/details/button/ButtonBase';

interface DestinyButtonProps {
  isGood: string;
  onClick?: () => void;
}

const DestinyButton: React.FC<DestinyButtonProps> = ({ isGood, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    if (isGood === 'Y') {
      //이 localstorage도 닫기버튼 눌렀을 때 메인페이지로 가게 할 거라 참고 부탁드립니다.!
      localStorage.setItem("FromDiary","goUniverse")
      console.log('행운번호 추천 페이지로 이동');
    } else {
      localStorage.setItem("FromDiary","goUniverse")
      console.log('오늘의 운세 페이지로 이동');
    }
  };

  const buttonText =
    isGood === 'Y' ? '행운번호 보러가기' : '오늘의 운세 보러가기';

  return (
    <ButtonBase
      onClick={handleClick}
      className="text-[15px]"
      width="200px">
      {buttonText}
    </ButtonBase>
  );
};

export default DestinyButton;
