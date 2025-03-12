import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../style/TodayFortune.css";

const TodayFortune = () => {
    const nav = useNavigate();
    const [isAnimated, setIsAnimated] = useState(false);
    const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
    
    const onClickHome = () => {
        nav("/");
    }
    
    const mockdata = [
        { content: "오늘은 작은 변화가 큰 기회를 가져올 날! 긍정적인 마음으로 도전해보세요." }
    ]
    
    // 컴포넌트가 마운트되면 입장 애니메이션 시작
    useEffect(() => {
        setTimeout(() => {
            setIsAnimated(true);
            // 초기 애니메이션 완료 후 호버 효과 활성화
            setTimeout(() => {
                setInitialAnimationComplete(true);
            }, 1500);
        }, 100);
    }, []);

    return (
        <div className="w-screen h-screen relative">
            <img src="space.png" alt="space background" className="w-full h-full"/>
            <div className="absolute top-3 right-4 text-2xl text-white">
                <button
                  onClick={onClickHome}
                  className="cursor-pointer hover:text-gray-200">
                  ✕
                </button>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`card-container ${isAnimated ? 'animated' : ''} ${initialAnimationComplete ? 'animation-complete' : ''}`}>
                    <img src="card.png" alt="fortune card" className="w-80"/>
                    
                    {/* 카드 내용 (텍스트) */}
                    {isAnimated && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-4 fortune-text">
                            <p>{mockdata[0].content}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TodayFortune;
