// 삭제하기 버튼

interface DeleteButtonProps {
  onDelete?: () => void;
  isMySpace?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  isMySpace = false,
}) => {
  // 내 우주가 아니면 표시 안함
  if (!isMySpace) {
    return null;
  }

  const handleDeleteClick = () => {
    console.log('삭제 버튼 직접 클릭');
    if (onDelete) {
      if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
        onDelete();
      }
    }
  };

  return (
    <button
      className="text-white/90 cursor-pointer w-full bg-[#ff5757]/90 hover:bg-[#e74c4c]/90 py-2 rounded text-sm font-bold"
      onClick={handleDeleteClick}>
      삭제하기
    </button>
  );
};

export default DeleteButton;
