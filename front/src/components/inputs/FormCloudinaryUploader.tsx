import React, { useRef, useState } from 'react';
import { Alert, Box, LinearProgress, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonTx from '@/components/ui/ButtonTx';
import { useCloudinaryUpload } from '@/hooks/cloudinary.hook';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export interface UploadedImage {
  id?: number;
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  bytes?: number;
}

// Props du composant
interface PhotoUploaderProps {
  images?: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  cloudinaryFolder: string;
  disabled?: boolean;
  maxWidth?: number | string;
  maxHeight?: number;
  accept?: string;
  multiple?: boolean;
  uploadLabel?: string;
  deleteLabel?: string;
  uploadingLabel?: string;
  errorLabel?: string;
  previewStyle?: React.CSSProperties;
  onError?: (error: string) => void;
  showProgress?: boolean;
}

const FormCloudinaryUploader: React.FC<PhotoUploaderProps> = ({
  images = [],
  onImagesChange,
  cloudinaryFolder,
  disabled = false,
  maxWidth = '100%',
  maxHeight = 120,
  accept = 'image/*',
  multiple = true,
  uploadLabel,
  uploadingLabel,
  previewStyle,
  onError,
  showProgress = true,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload: uploadImage, uploading, error: uploadError } = useCloudinaryUpload(cloudinaryFolder);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Gestion de l'upload avec validation et progression
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedImages: UploadedImage[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Mettre à jour la progression
        if (showProgress) {
          setUploadProgress((i / totalFiles) * 100);
        }

        const result = await uploadImage(file);
        if (result) {
          uploadedImages.push({
            url: result.url,
            publicId: result.public_id ?? '',
            width: result.width,
            height: result.height,
            format: result.format,
            resourceType: result.resourceType,
            bytes: result.bytes,
          });
        }
      }

      // Finaliser la progression
      if (showProgress) {
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
      }

      // Ajouter les nouvelles images
      onImagesChange([...images, ...uploadedImages]);

      // Réinitialiser l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Échec de l'upload";
      setValidationError(errorMessage);
      if (onError) onError(errorMessage);
    }
  };

  // Supprimer une image spécifique
  const handleDelete = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  // Labels par défaut
  const defaultUploadLabel = uploadLabel ?? t(Labels.koperative_form_logo_upload) ?? 'Ajouter des photos';
  const defaultUploadingLabel = uploadingLabel ?? t(Labels.koperative_form_logo_uploading) ?? 'Upload en cours...';

  return (
    <Box>
      {/* Bouton d'upload */}
      <Box sx={{ mb: 2 }}>
        <ButtonTx variant="outlined" component="label" startIcon={<UploadFileIcon />} fullWidth={images.length === 0}>
          {uploading ? defaultUploadingLabel : defaultUploadLabel}
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            hidden
            disabled={disabled || uploading}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </ButtonTx>
      </Box>

      {/* Barre de progression */}
      {showProgress && uploading && uploadProgress > 0 && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="textSecondary">
            {Math.round(uploadProgress)}%
          </Typography>
        </Box>
      )}

      {/* Messages d'erreur */}
      {(validationError || uploadError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setValidationError(null)}>
          {validationError ?? uploadError}
        </Alert>
      )}

      {/* Aperçu des images */}
      {images.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 2,
            mt: 2,
          }}
        >
          {images.map((img, index) => (
            <Box
              key={`${img.publicId}-${index}`}
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover .delete-btn': {
                  opacity: 1,
                },
              }}
            >
              <Box
                component="img"
                src={img.url}
                alt={`Photo ${index + 1}`}
                sx={{
                  width: maxWidth,
                  height: maxHeight,
                  objectFit: 'cover',
                  display: 'block',
                  ...previewStyle,
                }}
              />

              {/* Overlay avec informations */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  p: 1,
                }}
              >
                <Typography variant="caption" color="white" sx={{ fontSize: '0.7rem' }}>
                  {img.format?.toUpperCase()} • {img.bytes ? `${(img.bytes / 1024).toFixed(0)}KB` : ''}
                </Typography>
              </Box>

              {/* Bouton de suppression */}
              <ButtonTx
                className="delete-btn"
                size="small"
                variant="contained"
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  minWidth: 'auto',
                  width: 28,
                  height: 28,
                  opacity: 0.8,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
                onClick={() => handleDelete(index)}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </ButtonTx>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FormCloudinaryUploader;
