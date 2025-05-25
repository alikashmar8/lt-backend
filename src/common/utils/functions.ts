import { UploadedFileType } from '../enums/uploaded-file-type.enum';

export function generateFileUniqueName() {
  return Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('')
    .concat('_')
    .concat(Date.now().toString());
}

export function getDirectoryFromFileType(uploadType: UploadedFileType) {
  switch (uploadType) {
    case UploadedFileType.AUDIO:
      return 'audios';
    case UploadedFileType.IMAGE:
      return 'images';
    case UploadedFileType.VIDEO:
      return 'videos';
    default:
      return 'common';
  }
}

export function getImageFullUrl(s3Key: string): string {
  if (typeof s3Key == 'string' && s3Key.startsWith('http')) return s3Key;

  const bucketName =
    process.env.SERVER_ENV == 'development'
      ? process.env.MINIO_BUCKET
      : process.env.AWS_PUBLIC_BUCKET_NAME;
  const region = process.env.AWS_REGION;

  const encodedS3Key = encodeURIComponent(s3Key);

  // http://127.0.0.1:9001/my-bucket/rawadeed/7468c89aa23b07caea4102a55fb777348_1725206598279.png

  return process.env.SERVER_ENV == 'development'
    ? `http://127.0.0.1:9001/${bucketName}/${encodedS3Key}`
    : `https://${bucketName}.s3.${region}.amazonaws.com/${encodedS3Key}`;
  // return `https://${bucketName}.s3.${region}.amazonaws.com/${encodedS3Key}`;
}
