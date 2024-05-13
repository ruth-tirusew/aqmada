import { useEffect, useState } from "react";

const useNetworkStatus = () => {
  const [isOnline, setOnline] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState(false)

  const updateNetworkStatus = () => {
    setOnline(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("load", updateNetworkStatus);
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    return () => {
        window.removeEventListener("load", updateNetworkStatus);
        window.removeEventListener("online", updateNetworkStatus);
        window.removeEventListener("offline", updateNetworkStatus);

        if(isOnline){
            setIsVisible(true)
            setTimeout(()=>{
                setIsVisible(false)
            },5000)
            
        }
    };
  }, [navigator.onLine]);

  return { isOnline, isVisible };
};

export default useNetworkStatus;