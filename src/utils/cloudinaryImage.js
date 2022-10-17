// Client side redering use cloudinary-core
require('dotenv').config();
const cloudinary = require('cloudinary/lib/cloudinary');

cloudinary.config({
    cloud_name: 'duuqp3zwi',
    api_key: '795514826956293',
    api_secret: 'B-aeOwvQrgoC1jp2p-RbCULiJDo',
});

module.exports = cloudinary;
