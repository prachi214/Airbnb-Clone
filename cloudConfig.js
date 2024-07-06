const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// we pass here config info

// for connecting our cloudinary with backend

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// backend ko bataya cloudinary m bo folder where our file is storing
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
    //   jis bhi format m hm apni file upload kr rhe h

      allowerdFormat: async (req, file) => ["png","jpg","jpeg"],

    },
  });

  module.exports = {
    cloudinary,
    storage
  }
