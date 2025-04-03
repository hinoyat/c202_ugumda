import { useSelector } from "react-redux";
import { selectUser } from "@/stores/auth/authSelectors";
import { getIconById } from '@/hooks/ProfileIcons';


const UserInfoData = ()=>{
    const user = useSelector(selectUser)
    console.log(user)

    return(
    <div className="flex flex-row items-center gap-6 mt-7.5">
    <img
      src={getIconById((user as any).iconSeq)}
      alt="프로필 사진"
      className="w-13 h-14"
    />
    <div>
        <p className="text-gray-200/70 text-[14px]">{user?.birthDate}</p>
        <h1 className="text-white/85 text-[16px]">{user?.nickname}</h1>
    </div>
  </div>
);
}
export default UserInfoData