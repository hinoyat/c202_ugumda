import SignupForm from "../components/SignupForm";
import signupVideo from "@/assets/video/signupVideo.mp4"
import signup_image from "@/assets/images/signup_image.svg"

const Signup =() => {

    return (
        <div className="relative h-screen w-screen">
          <video
            src={signupVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover absolute"
          />
    
          <div className="absolute inset-0 flex items-center justify-center">
            
            {/* 왼쪽 이미지 */}
            <div className="h-[75vh]">
              <img src={signup_image} alt="loginImage" className="object-contain h-full rounded" />
            </div>

            <SignupForm/>

            
          </div>
        </div>
      );
    };
export default Signup;