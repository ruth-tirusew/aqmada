import Image from "next/image";
import { PiSpinner } from "react-icons/pi";

const LoadingPage = () => {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center my-auo justify-center align-center p-10">
      <Image src={"/aqmada-03.png"} width={100} height={240} alt="logo" className="w-auto h-auto"/>
      <PiSpinner className="h-10 w-10 animate-spin text-[#00A0EA]" />
    </div>
  );
};

export default LoadingPage;
