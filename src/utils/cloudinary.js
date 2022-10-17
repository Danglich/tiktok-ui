// Client side redering use cloudinary-core
require('dotenv').config();
const cloudinary = require('cloudinary/lib/cloudinary');

cloudinary.config({
    cloud_name: 'ddfmsvgeb',
    api_key: '683124881276837',
    api_secret: '5aieLJW3aQJ4ynIF9ql9-UsBWGo',
});

module.exports = cloudinary;
