import LockToggle from '@/common/LockToggle';
import '../../styles/DetailHeader.css';

interface DetailHeaderProps {
  title: string;
  created_at: string;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({ title, created_at }) => {
  return (
    <div className="flex w-full">
      <div className="flex flex-col">
        <h1 className="text-white text-2xl">{title}</h1>
        <p className="text-[rgb(255,255,255,0.7)] ">{created_at}</p>
      </div>
      <div>
        <LockToggle />
      </div>
    </div>
  );
};

export default DetailHeader;
