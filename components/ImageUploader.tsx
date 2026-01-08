import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  previewSrc: string | null;
  onImageUpload: (file: File) => void;
  icon: React.ReactNode;
}

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ label, previewSrc, onImageUpload, icon }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4 text-gray-200">{label}</h3>
      <div
        onClick={handleClick}
        className="relative group w-full h-64 border-2 border-gray-600 rounded-lg flex items-center justify-center cursor-pointer bg-slate-800/50 hover:border-brand-primary transition-all duration-300 overflow-hidden"
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        {previewSrc ? (
          <>
            <img src={previewSrc} alt={label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
               <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <EditIcon />
               </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400">
            {icon}
            <p>Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;