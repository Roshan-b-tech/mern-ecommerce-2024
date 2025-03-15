const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();

// Debug environment variables
console.log('Environment Check:', {
  has_cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
  has_api_key: !!process.env.CLOUDINARY_API_KEY,
  has_api_secret: !!process.env.CLOUDINARY_API_SECRET,
  values: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY?.slice(-4), // Show only last 4 chars for security
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : undefined
  }
});

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify Cloudinary configuration
const verifyConfig = () => {
  try {
    const config = cloudinary.config();
    console.log('Cloudinary Config:', {
      has_cloud_name: !!config.cloud_name,
      has_api_key: !!config.api_key,
      has_api_secret: !!config.api_secret,
      cloud_name: config.cloud_name
    });

    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error('Missing Cloudinary configuration. Please check your .env file');
      throw new Error("Missing Cloudinary configuration");
    }

    console.log("Cloudinary configuration verified successfully");
    return true;
  } catch (error) {
    console.error("Cloudinary configuration error:", error.message);
    return false;
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

async function imageUploadUtil(dataUri) {
  if (!verifyConfig()) {
    throw new Error("Cloudinary is not properly configured. Please check your environment variables.");
  }

  if (!dataUri) {
    throw new Error("No data URI provided");
  }

  if (!dataUri.startsWith('data:')) {
    throw new Error("Invalid data URI format");
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(dataUri, {
      resource_type: "auto",
      folder: "mern-ecommerce",
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" }
      ]
    })
      .then(result => {
        if (!result || !result.secure_url) {
          throw new Error("Invalid response from Cloudinary");
        }
        console.log("Successfully uploaded to Cloudinary:", {
          public_id: result.public_id,
          url: result.secure_url,
          format: result.format,
          size: result.bytes
        });
        resolve(result);
      })
      .catch(error => {
        console.error("Cloudinary upload error:", error);
        reject(error);
      });
  });
}

module.exports = { upload, imageUploadUtil };
