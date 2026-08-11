import { Gare, UserOperator } from '@/types';
import { useMemo, useState } from 'react';

export interface CloudinaryUploadResult {
  url: string;
  public_id?: string;
  format?: string;
  resourceType?: string;
  bytes?: number;
  width?: number;
  height?: number;
  userinfo?: UserOperator;
  gares?: Gare[];
}

// TODO: Make upload secure by using a server-side endpoint to handle the upload
// FOR sensitive data, use a server-side endpoint to handle the upload securely
export function useCloudinaryUpload(folder: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CloudinaryUploadResult | null>(null);

  const upload = useMemo(() => {
    return async (file: File) => {
      setUploading(true);
      setError(null);
      setResult(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'taxibrousse+txb');
      formData.append('folder', `taxibrousse/${folder}`);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/dm4m7evkz/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          setResult({
            url: data.secure_url,
            public_id: data.public_id,
            width: data.width,
            height: data.height,
            resourceType: data.resource_type,
            format: data.format,
            bytes: data.bytes,
            userinfo: data.userinfo,
            gares: [],
          });
          return {
            url: data.secure_url,
            public_id: data.public_id,
            width: data.width,
            height: data.height,
            resourceType: data.resource_type,
            format: data.format,
            bytes: data.bytes,
            userinfo: data.userinfo,
            gares: data.gares || [],
          };
        } else {
          setError(data.error?.message ?? 'Upload failed');
          return null;
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        return null;
      } finally {
        setUploading(false);
      }
    };
  }, [folder]);

  return { upload, uploading, error, result };
}
