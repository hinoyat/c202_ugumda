import { useSelector } from "react-redux";
import { selectUser } from "@/stores/auth/authSelectors";
import { useEffect, useRef } from "react";
import Highcharts from 'highcharts';
import { dreamPeriodData } from "./SampleGraphDataTwoWeeks";


interface GgumGrapProps {
    periodName?: number;
    height?: number | string
}

const GgumGraph = ({periodName=30, height = "50%"}: GgumGrapProps)=>{
    const user = useSelector(selectUser)
    const chartRef = useRef(null);

    useEffect(()=>{
        if (!chartRef.current) 
            return;
        
        // 해당 기간의 데이터 찾기
        const periodData = dreamPeriodData.find(item => item.name === periodName);

        if (!periodData){
            console.error(`${periodName}일 기간의 데이터를 찾을 수 없습니다.`);
            return;
        }

        const emotions = periodData?.data.map(item => item.emotion)
        const emotionsCounts = periodData?.data.map(item=>item.count)
        console.log(emotions)
           
        Highcharts.chart(chartRef.current, {
            chart: {
                backgroundColor: '#000000',  // 검은색 배경 설정
                height: height
            },

            title: {
                text: `${user?.nickname}님의 ${periodName}일 간의 꿈 그래프`,
                style: {
                    color: '#109a6d'
                }
            },
        
            accessibility: {
                point: {
                    valueDescriptionFormat:
                        '{xDescription}{separator}{value} million(s)'
                }
            },
        
            xAxis: {
                categories: emotions,
                labels: {
                    style: {
                        color: '#FFFFFF'  // 흰색 x축 레이블
                    }
                },
                lineColor: '#FFFFFF'  // 흰색 x축 선
            },
        
            yAxis: {
                title:{
                    text:''
                },
                labels: {
                    style: {
                        color: '#FFFFFF'  // 흰색 y축 레이블
                    }
                },
                gridLineColor: 0  // 그리드 라인 제거
            },
        
            tooltip: {
                formatter: function() {
                    return `<b>${this.category} 감정의 꿈</b><br/>${this.y}개`;
                },
                style: {
                    textAlign: 'center',
                    fontWeight: 'bold'
                },
                useHTML: true 
            },
        
            series: [{
                name: '꿈 기록 수',
                data: emotionsCounts,
                color: '#FFFFFF',
                marker: {
                    enabled: true, // 포인트를 표시하도록 설정
                    radius: 5, // 포인트의 크기
                    fillColor: '#ffffff', // 포인트 색상을 흰색으로 설정
                    lineWidth: 2, // 포인트의 테두리 두께
                    lineColor: '#ffffff', // 포인트 테두리 색상
                    states: {
                        hover: {
                            enabled: true,
                            fillColor: '#ffffff', // 호버 시 포인트 색상
                            lineColor: '#ffffff', // 호버 시 테두리 색상
                            radius: 7 // 호버 시 포인트 크기 증가
                        }
                    },
                    shadow: {
                        color: 'rgba(255, 255, 255, 0.5)', // 그림자 색상
                        offsetX: 0,
                        offsetY: 0,
                        opacity: 1,
                        width: 10 // 그림자 크기
                    }
                }
            }],
            legend: {
                enabled: false  // 범례 완전히 제거
            },
            credits: {
                enabled: false  
            }
        });
        })
    
    
    
    return(
        <div ref={chartRef}>

        </div>
    )
}
export default GgumGraph
