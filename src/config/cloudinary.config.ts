import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = (cloud_name: string, api_key: string, api_secret: string) => {
  cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
  });
};

export default cloudinary;
