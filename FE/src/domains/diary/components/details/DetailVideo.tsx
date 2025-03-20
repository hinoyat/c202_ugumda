import miroVideo from '@/assets/video/miro-video.mp4';
interface DiaryDetailProps {
  dream_video?: string | null;
}

// const DetailVideo: React.FC<DiaryDetailProps> = ({ dream_video }) => {
//   return (
//     <div>
//       <video src={dream_video}></video>
//     </div>
//   );
// };

const DetailVideo: React.FC<DiaryDetailProps> = ({
  dream_video = miroVideo, // 기본값으로 miroVideo 설정
}) => {
  return (
    <div className="w-full h-auto">
      <video
        src={dream_video}
        controls
        className="w-full rounded-lg shadow-md"
        playsInline>
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default DetailVideo;
