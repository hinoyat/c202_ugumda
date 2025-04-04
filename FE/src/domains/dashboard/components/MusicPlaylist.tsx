import React, { useState, useRef, useEffect } from 'react';
import { MusicList, MusicCategory, MusicTrack } from "./MusicData"
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faPlay, faStop, faForward } from '@fortawesome/free-solid-svg-icons';
import 'font-awesome/css/font-awesome.min.css';

interface Song {
  name: string;
  category: string;
  img: string;
  audio: string;
  duration: string;
}

const flattenedMusicList: Song[] = MusicList.flatMap(category => 
  category.tracks.map(track => ({
    name: track.title,
    category: category.name, 
    img: track.image,
    audio: track.audio,
    duration: track.duration 
  }))
);



const MusicPlaylist: React.FC = () => {
  const [index, setIndex] = useState<number>(3);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [pause, setPause] = useState<boolean>(false);
  
  const playerRef = useRef<HTMLAudioElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const hoverPlayheadRef = useRef<HTMLDivElement>(null);
  


  useEffect(() => {
    if (!playerRef.current || !timelineRef.current || !playheadRef.current || !hoverPlayheadRef.current) return;
    
    playerRef.current.addEventListener("timeupdate", timeUpdate);
    playerRef.current.addEventListener("ended", nextSong);
    timelineRef.current.addEventListener("click", changeCurrentTime);
    timelineRef.current.addEventListener("mousemove", hoverTimeLine);
    timelineRef.current.addEventListener("mouseout", resetTimeLine);

    return () => {
      if (!playerRef.current || !timelineRef.current) return;
      
      playerRef.current.removeEventListener("timeupdate", timeUpdate);
      playerRef.current.removeEventListener("ended", nextSong);
      timelineRef.current.removeEventListener("click", changeCurrentTime);
      timelineRef.current.removeEventListener("mousemove", hoverTimeLine);
      timelineRef.current.removeEventListener("mouseout", resetTimeLine);
    };
  }, []);

  useEffect(() => {
    updatePlayer();
  }, [index]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    const formattedSeconds = secs >= 10 ? secs.toString() : "0" + secs.toString();
    return `${minutes}:${formattedSeconds}`;
  };

  const timeUpdate = (): void => {
    if (!playerRef.current || !playheadRef.current || !timelineRef.current) return;
    
    const duration = playerRef.current.duration;
    const playPercent = 100 * (playerRef.current.currentTime / duration);
    playheadRef.current.style.width = `${playPercent}%`;
    
    const currentTimeFormatted = formatTime(playerRef.current.currentTime);
    setCurrentTime(currentTimeFormatted);
  };

  const changeCurrentTime = (e: MouseEvent): void => {
    if (!playerRef.current || !playheadRef.current || !timelineRef.current) return;
    
    const duration = playerRef.current.duration;
    const playheadWidth = timelineRef.current.offsetWidth;
    const offsetWidth = timelineRef.current.offsetLeft;
    const userClickWidth = e.clientX - offsetWidth;
    
    const userClickWidthInPercent = (userClickWidth * 100) / playheadWidth;
    
    playheadRef.current.style.width = `${userClickWidthInPercent}%`;
    playerRef.current.currentTime = (duration * userClickWidthInPercent) / 100;
  };

  const hoverTimeLine = (e: MouseEvent): void => {
    if (!playerRef.current || !hoverPlayheadRef.current || !timelineRef.current) return;

    const duration = playerRef.current.duration;
    const playheadWidth = timelineRef.current.offsetWidth;
    const offsetWidth = timelineRef.current.offsetLeft;
    const userClickWidth = e.clientX - offsetWidth;
    const userClickWidthInPercent = (userClickWidth * 100) / playheadWidth;
    
    if (userClickWidthInPercent <= 100) {
      hoverPlayheadRef.current.style.width = `${userClickWidthInPercent}%`;
    }
    
    const time = (duration * userClickWidthInPercent) / 100;
    
    if (time >= 0 && time <= duration) {
      hoverPlayheadRef.current.dataset.content = formatTime(time);
    }
  };

  const resetTimeLine = (): void => {
    if (!hoverPlayheadRef.current) return;
    hoverPlayheadRef.current.style.width = '0';
  };

  const updatePlayer = (): void => {
    if (!playerRef.current) return;
    playerRef.current.load();
  };

  const nextSong = (): void => {
    setIndex((prevIndex) => (prevIndex + 1) % flattenedMusicList.length);
    
    if (pause && playerRef.current) {
      playerRef.current.play();
    }
  };

  const prevSong = (): void => {
    setIndex((prevIndex) => (prevIndex + flattenedMusicList.length - 1) % flattenedMusicList.length);
    
    if (pause && playerRef.current) {
      playerRef.current.play();
    }
  };

  const playOrPause = (): void => {
    if (!playerRef.current) return;
    
    if (!pause) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
    
    setPause(!pause);
  };

  const clickAudio = (key: number): void => {
    setIndex(key);
    
    if (pause && playerRef.current) {
      playerRef.current.play();
    }
  };

  const currentSong = flattenedMusicList[index];

  // SVG 데이터 URL
  const svgUrl = "data:image/svg+xml,%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 56 56' style='enable-background:new 0 0 56 56;' xml:space='preserve'%3E%3Cpath style='fill:%23071739;' d='M47.799,8.201c-10.935-10.935-28.663-10.935-39.598,0c-10.935,10.935-10.935,28.663,0,39.598 c10.935,10.935,28.663,10.935,39.598,0C58.734,36.864,58.734,19.136,47.799,8.201z M32.95,32.95c-2.734,2.734-7.166,2.734-9.899,0 c-2.734-2.734-2.734-7.166,0-9.899s7.166-2.734,9.899,0S35.683,30.216,32.95,32.95z'/%3E%3Cpath style='fill:%23E7ECED;' d='M35.778,20.222c-4.296-4.296-11.261-4.296-15.556,0c-4.296,4.296-4.296,11.261,0,15.556 c4.296,4.296,11.261,4.296,15.556,0C40.074,31.482,40.074,24.518,35.778,20.222z M30.121,30.121c-1.172,1.172-3.071,1.172-4.243,0 s-1.172-3.071,0-4.243s3.071-1.172,4.243,0S31.293,28.95,30.121,30.121z'/%3E%3Cg%3E%3Cpath style='fill:%23709fdc;' d='M35.778,35.778c-0.76,0.76-1.607,1.378-2.504,1.87l8.157,14.92c2.284-1.25,4.434-2.835,6.368-4.769 c1.934-1.934,3.519-4.084,4.769-6.368l-14.92-8.157C37.157,34.172,36.538,35.018,35.778,35.778z'/%3E%3Cpath style='fill:%23709fdc;' d='M20.222,20.222c0.76-0.76,1.607-1.378,2.504-1.87l-8.157-14.92c-2.284,1.25-4.434,2.835-6.368,4.769 s-3.519,4.084-4.769,6.368l14.92,8.157C18.843,21.828,19.462,20.982,20.222,20.222z'/%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className="absolute w-[93%] h-[88%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col justify-center items-center max-w-[371px] py-0 px-[5px] mt-[0px] ml-[10vw] rounded-[20px] text-white font-light shadow-[0px_0px_70px_0px_#274684] bg-[#071739] overflow-hidden">
        <div className="flex flex-col items-center w-full py-[20px] px-0 rounded-[20px] text-[#071739] bg-white">
          <audio ref={playerRef}>
            <source src={currentSong.audio} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
          
          <div className="relative mx-auto w-[270px] h-[200px] overflow-hidden rounded-[20px] shadow-[0px_10px_40px_0px_rgba(39,70,132,0.7)]">
            <img src={currentSong.img} alt={currentSong.name} className="w-auto h-full" />
          </div>
          
          <span className="mt-[30px] text-[22px]">{currentSong.name}</span>
          <span className="text-[#709fdc]">{currentSong.category}</span>
          
          <div className="flex justify-between mt-[10px] w-[240px]">
            <div>{currentTime}</div>
            <div>{currentSong.duration}</div>
          </div>
          
          <div ref={timelineRef} className="relative mx-auto w-[240px] h-[5px] bg-[#709fdc] rounded-[5px] cursor-pointer hover:[&_.hover-playhead]:opacity-100">
            <div ref={playheadRef} className="relative z-[2] w-0 h-[5px] rounded-[5px] bg-[#071739]"></div>
            <div 
              ref={hoverPlayheadRef} 
              className="hover-playhead absolute z-[1] top-0 w-0 h-[5px] opacity-0 rounded-[5px] bg-[#274684] transition-opacity duration-300" 
              data-content="0:00"
            ></div>
          </div>
          
          <div className="mt-[10px]">
            <button onClick={prevSong} className="text-[#071739] rounded-full mx-[15px] text-[18px] text-center transition-[0.2s] cursor-pointer border-none bg-[transparent] focus:outline-none w-[35px] h-[35px] hover:transform hover:scale-[1.2]">
               <FontAwesomeIcon icon={faBackward} />
            </button>
            
            <button onClick={playOrPause} className="text-[#071739] rounded-full mx-[15px] text-[18px] text-center transition-[0.2s] cursor-pointer border border-[#e2e2e2] bg-[transparent] focus:outline-none w-[50px] h-[50px] hover:left-0 hover:shadow-[0px_0px_15px_0px_rgba(39,70,132,0.7)]">
              {!pause ? (
                <FontAwesomeIcon icon={faPlay} />
              ) : (
                <FontAwesomeIcon icon={faStop} />
              )}
            </button>
            
            <button onClick={nextSong} className="text-[#071739] rounded-full mx-[15px] text-[18px] text-center transition-[0.2s] cursor-pointer border-none bg-[transparent] focus:outline-none w-[35px] h-[35px] hover:transform hover:scale-[1.2]">
                <FontAwesomeIcon icon={faForward} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col p-[10px] h-[180px] overflow-y-scroll [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-white [&::-webkit-scrollbar-thumb]:rounded-[5px] [&::-webkit-scrollbar-track]:bg-[#071739]">
          {flattenedMusicList.map((music, key) => (
            <div
              key={key}
              onClick={() => clickAudio(key)}
              className={`
                flex items-center mb-[10px] rounded-[10px] border border-transparent transition-[0.3s] cursor-pointer
                hover:bg-[#274684] hover:border-[#274684] hover:relative
                ${index === key && !pause ? 'bg-[#274684] shadow-[0px_0px_15px_0px_#274684]' : ''}
                ${index === key && pause ? `bg-[#274684] shadow-[0px_0px_15px_0px_#274684] relative after:content-[''] after:block after:absolute after:left-[17px] after:w-[57px] after:h-[57px] after:rounded-[10px] after:text-[16px] after:animate-[play_2s_linear_infinite] after:bg-[url("${svgUrl}")]` : ''}
              `}
            >
              <img 
                className={`w-[90px] rounded-[10px] ${index === key && pause ? 'opacity-[70%]' : ''}`} 
                src={music.img} 
                alt={music.name} 
              />
              <div className="ml-[15px] flex flex-col min-w-[190px]">
                <span className="text-[17px] mt-[8px]">{music.name}</span>
                <span className="mt-[8px] font-[300] text-[#709fdc]">{music.category}</span>
              </div>
              <span className="min-w-[40px] ml-[10px] mr-[10px] font-[500]">
                {index === key ? currentTime : music.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlaylist;