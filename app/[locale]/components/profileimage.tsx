import { createContext, useEffect, useState } from "react";


import { TbPhotoPlus } from 'react-icons/tb'


interface CloudinaryUploadWidgetProps {
  uwConfig:  {
    cloudName: string;
    uploadPreset: string;
  };
  setPublicId: (publicId: string) => void;
  onChange: (value: string) => void;
  value: string;
}

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext({
  loaded: false,
});

function ImageUpload({ uwConfig, setPublicId, onChange, value }: CloudinaryUploadWidgetProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      try {
        const widget = window.cloudinary.createUploadWidget(
          {
            uwConfig,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
          },
          (error: never, result: { event: string; info: { secure_url: string } }) => {
             onChange(result.info.secure_url)
              setPublicId(result.info.secure_url);
          }
        );
        widget.open();
      } catch (err: unknown) {
        console.log(err);
      }
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
                <div
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2
              p-20
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
              rounded-full
            "
            id="upload_widget"
            onClick={initializeCloudinaryWidget}
          >
            <TbPhotoPlus
              className="
                w-8
                h-8
                text-neutral-600
              "
            />
            {value && (
              <div className="
              absolute inset-0 w-full h-full">
                <img 
                  style={{ objectFit: 'cover' }} 
                  src={value} 
                  alt="Image" 
                />
              </div>
            )}
          </div>
    </CloudinaryScriptContext.Provider>
  );
}

export default ImageUpload;
export { CloudinaryScriptContext };