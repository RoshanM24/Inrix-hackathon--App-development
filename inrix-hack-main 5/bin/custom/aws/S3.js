const AWS = require('aws-sdk');
const fs = require('fs');
const uniqid = require('uniqid');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_S3_REGION,
  signatureVersion: 'v4',
});

const uploadFile = async (fileName, name,id) => {
  return new Promise((resolve, reject) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${id}_${name.replace(/\s/g, '')}`, // File name you want to save as in S3
      Body: fileContent,
    };
    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err);
        // console.log(err,"error"); 
        throw err;
      }
      resolve(data);
    });
  });
};

const deleteFile = async (fileName) => {
  return new Promise((resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileName, // File name you want to delete from S3
    };

    // deleting file from bucket
    s3.deleteObject(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getSignedURL = async (bucket, fileName, expriySeconds) => {
  return s3.getSignedUrl('getObject', {
    Bucket: bucket,
    Key: fileName,
    Expires: expriySeconds,
  });
};

module.exports = { s3, uploadFile, getSignedURL, deleteFile };
