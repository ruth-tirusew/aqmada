import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { TbPhotoPlus } from 'react-icons/tb';

interface ImageUploadProps {
  onChange: (value: string) => void;
  locale: "en" | "am";
  value?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value, locale = "en" }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const api_key = "AmdeORpwsw7AJGbbjfwAYgPk1yQ"
  const cloud_name = "dnqkrebrb"

  useEffect(() => {
    if (value) {
      setPreviews([value]);
    } else {
      setPreviews([]);
    }
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const newPreviews = acceptedFiles.map((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            setPreviews((prevPreviews) => [...prevPreviews, reader.result as string]);
          };
          reader.readAsDataURL(file);
          return null;
        });

        // Upload images when files are dropped
        try {
          const formData = new FormData();
          acceptedFiles.forEach((file) => {
            formData.append("file", file);
          });
          formData.append("upload_preset", "uc2udcgh");
          formData.append("api_key",api_key);

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            formData
          );
          onChange(response.data.secure_url);
        } catch (error) {
          console.error("Error uploading images:", error);
          // Handle error
        }
      }
    },
    [setPreviews, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <>
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
          rounded-lg
        "
        id="upload_widget"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="">
            <TbPhotoPlus
              className="
                w-8
                h-8
                text-neutral-600
              "
            />
          </div>
        )}
      </div>
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {previews.map((preview, index) => (
            <img key={index} src={preview} alt={`Preview ${index + 1}`} />
          ))}
        </div>
      )}
    </>
  );
};

export default ImageUpload;
