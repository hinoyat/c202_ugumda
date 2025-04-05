import miroVideo from '@/assets/video/miro-video.mp4';
interface DiaryDetailProps {
  dream_video?: string | null;
}

const DetailVideo: React.FC<DiaryDetailProps> = ({ dream_video }) => {
  const videoSrc = dream_video || miroVideo;

  return (
    <div className="w-full h-auto">
      <video
        src={videoSrc}
        controls
        className="w-full rounded-lg shadow-md"></video>
    </div>
  );
};

export default DetailVideo;
