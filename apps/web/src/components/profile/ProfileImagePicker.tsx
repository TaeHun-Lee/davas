import { useEffect, useState } from 'react';
import { normalizeProfileImageUrl } from '../../lib/api/auth';
import { DefaultProfileAvatar } from './DefaultProfileAvatar';

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
    <label aria-label={`${displayName} 프로필 사진 선택`} className="mx-auto grid h-[108px] w-[108px] cursor-pointer place-items-center overflow-hidden rounded-full bg-[#f8d8c9] shadow-[0_16px_30px_rgba(31,65,114,0.16)]">
      {visibleImageUrl ? <img src={visibleImageUrl} alt="" className="h-full w-full object-cover" /> : <DefaultProfileAvatar initial={displayName} className="text-[34px]" />}
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
