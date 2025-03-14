interface DiaryDetailProps {
  dream_video: string;
}
const DetailVideo: React.FC<DiaryDetailProps> = ({ dream_video }) => {
  return (
    <div>
      <video src={dream_video}></video>
    </div>
  );
};

export default DetailVideo;
