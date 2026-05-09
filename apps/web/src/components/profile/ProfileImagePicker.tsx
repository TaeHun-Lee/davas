import { useEffect, useState } from 'react';
import { normalizeProfileImageUrl } from '../../lib/api/auth';

type ProfileImagePickerProps = {
  imageUrl?: string | null;
  displayName: string;
  onFileSelect: (file: File) => void;
};

export function ProfileImagePicker({ imageUrl, displayName, onFileSelect }: ProfileImagePickerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const visibleImageUrl = previewUrl ?? normalizeProfileImageUrl(imageUrl);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <label className="mx-auto grid h-[108px] w-[108px] cursor-pointer place-items-center overflow-hidden rounded-full bg-[linear-gradient(145deg,#dbe7f8,#f7f0e6)] text-[34px] font-black text-[#2e5c9f] shadow-[0_16px_30px_rgba(31,65,114,0.16)]">
      {visibleImageUrl ? <img src={visibleImageUrl} alt="" className="h-full w-full object-cover" /> : displayName.slice(0, 1).toUpperCase()}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (!file) return;
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(URL.createObjectURL(file));
          onFileSelect(file);
        }}
      />
    </label>
  );
}
