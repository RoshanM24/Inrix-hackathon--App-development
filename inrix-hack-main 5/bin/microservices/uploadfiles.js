const Files = require('../models/files');
const fs = require('fs');
const path = require('path');
const { uploadFile } = require('../custom/aws/S3');
const uniqid = require('uniqid');


const galleryImages = async (req,res) => {
    try {
      const body = JSON.parse(JSON.stringify(req.body));
      if (req.files.gallery && req.files.gallery?.length>0) {
        await Promise.all(
          req.files.gallery.map(async (file) => {
            let keys = await uploadFile(path.join(file.path), file.originalname,uniqid());
            fs.unlinkSync(path.join(file.path));
             let filesData = new Files({
                  docName:`${file.originalname}`,
                  docUrl:keys.Key
              });
              await filesData.save();
          })
        );
      }
    } catch (error) {
      console.log(`***** ERROR : ${req.originalUrl} ${error}`);
      return res.status(error.code || 401).json({
        success: false,
        details: error || {
          code: 401,
          name: 'Authorization Failed! - Devloper Defined Error!',
          message: "Uh oh! i can't tell you anymore #BruteForcers! alert",
        },
      });
    }
  };

module.exports = {
  galleryImages
}