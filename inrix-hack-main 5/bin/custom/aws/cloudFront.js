const AWS = require('aws-sdk');
const cloudFront = new AWS.CloudFront.Signer(
  process.env.CF_ACCESS_KEY_ID,
  process.env.CF_PRIVATE_KEY
);

const getsignedUrl = async (aws_CDN, objectKey, expiryHrs) => {
  let obj = objectKey.split('.');
  console.log(obj);
  return cloudFront.getSignedUrl({
    url: `https://${aws_CDN}/*${obj[0]}*.${obj[1]}`,
    expires: Math.floor(new Date().getTime() / 1000) + 60 * 60 * expiryHrs, // Unix UTC timestamp for now + 2 days
  });
};

const getsignedUrlCustomPolicy = async (aws_CDN, objectKey, expiryHrs, ip) => {
  var customPolicy = JSON.stringify({
    Statement: [
      {
        Resource: `https://${aws_CDN}/${objectKey}`,
        Condition: {
          DateGreaterThan: {
            'AWS:EpochTime': Math.floor(new Date().getTime() / 1000),
          },
          DateLessThan: {
            'AWS:EpochTime':
              Math.floor(new Date().getTime() / 1000) + 60 * 60 * expiryHrs,
          },
          //   IpAddress: {
          //     "AWS:SourceIp": ip
          // }
        },
      },
    ],
  });

  options = {
    url: `https://${aws_CDN}/${objectKey}`,
    policy: customPolicy,
  };
  let signedUrl = cloudFront.getSignedUrl(options);

  return {
    url: signedUrl,
  };
};

module.exports = { getsignedUrl, getsignedUrlCustomPolicy };
