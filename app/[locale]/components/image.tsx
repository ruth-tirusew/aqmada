'use client';

import { getDictionary } from "@/lib/locales";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { TbPhotoPlus } from 'react-icons/tb'

declare global {
  var cloudinary: any
}

const uploadPreset = "cxd5yz2q";

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
  locale: "en" | "am";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value,
  locale="en"
}) => {
  const handleUpload = useCallback((result: any) => {
    onChange(result.info.secure_url);
  }, [onChange]);

  const [dict, setDict] = useState<any>();

  const dictionary = async () => {
    try {
      const data = await getDictionary(locale);
      setDict(data);
    } catch (error) {
      console.error("Dictionary error:", error);
    }
  };

  useEffect(() => {
    dictionary();
  }, []);

  return (
    <CldUploadWidget 
      onUpload={handleUpload} 
      uploadPreset={uploadPreset}
      options={{
        maxFiles: 3
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2
              px-20
              py-10 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
            "
          >
            <TbPhotoPlus
              className="
                w-12
                h-12
                text-neutral-600
                dark:text-white
              "
            />
            <div className="font-semibold text-md dark:text-white">
              {dict?.click}
            </div>
            {value && (
              <div className="
              absolute inset-0 w-full h-full">
                <Image
                  fill 
                  style={{ objectFit: 'cover' }} 
                  src={value} 
                  alt="Image" 
                />
              </div>
            )}
          </div>
        ) 
    }}
    </CldUploadWidget>
  );
}

export default ImageUpload;
