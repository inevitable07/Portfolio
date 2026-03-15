import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(
  fileBuffer: Buffer,
  folder = 'portfolio/projects',
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 630, crop: 'fill', gravity: 'auto', quality: 'auto', format: 'webp' },
          ],
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      )
      .end(fileBuffer);
  });
}

export async function uploadIcon(
  fileBuffer: Buffer,
  folder = 'portfolio/skills',
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'auto', quality: 'auto', format: 'webp' },
          ],
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      )
      .end(fileBuffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
