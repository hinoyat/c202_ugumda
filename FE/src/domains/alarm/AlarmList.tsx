import React, { useEffect, useRef, useCallback } from 'react';
import { IoClose } from 'react-icons/io5';
import { useAppDispatch } from '@/hooks/hooks';
import { useSelector } from 'react-redux';
import { fetchAlarms, updateAlarm } from './stores/alarmThunks';
import {
  selectAlarms,
  selectLoading,
  selectHasMore,
} from './stores/alarmSelectors';
import { Alarm } from './stores/alarmTypes';

interface AlarmProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlarmList: React.FC<AlarmProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const dispatch = useAppDispatch();
  const alarms = useSelector(selectAlarms);
  const loading = useSelector(selectLoading);
  const hasMore = useSelector(selectHasMore);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastAlarmRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchAlarms());
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch]
  );

  useEffect(() => {
    dispatch(fetchAlarms());
  }, [dispatch]);

  // 알림 하나 클릭
  const handleAlarmClick = (alarm: Alarm) => {
    console.log('알림 눌렀지롱', alarm);
    if (alarm.isRead === 'N') {
      dispatch(updateAlarm(alarm.alarmSeq));
    }
    onClose();
  };

  return (
    <div className="absolute inset-0">
      {/* 모달 배경 */}
      <div className="absolute w-[30%] h-80 rounded-lg py-6 px-6 top-[60px] left-7/12 bg-[#6E6E6E]/90 z-25 flex flex-col items-center">
        {/* 닫기버튼 */}
        <div
          className="absolute z-40 top-[2%] right-[1%] cursor-pointer"
          onClick={onClose}>
          <IoClose className="text-white text-3xl" />
        </div>
        <div className="bg-amber-500 w-full h-full overflow-y-auto relative">
          <div className="px-4 sticky top-0 flex justify-between items-center h-[50px] bg-amber-700">
            <p className="text-white font-semibold text-[24px]">알림</p>
            <div className="flex gap-4">
              <button>전체 삭제</button>
              <button>전체 읽음</button>
            </div>
          </div>
          {alarms.map((alarm, index) => (
            <div
              onClick={() => handleAlarmClick(alarm)}
              key={alarm.alarmSeq}
              ref={index === alarms.length - 1 ? lastAlarmRef : null}
              className={`p-4 border-b border-gray-300 ${alarm.isRead === 'N' ? 'bg-red-500' : 'bg-white'}`}>
              {alarm.content}
            </div>
          ))}
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
};

export default AlarmList;
