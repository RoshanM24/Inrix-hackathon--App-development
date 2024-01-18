const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const customError = require('../custom/customError');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const bcrypt = require('bcryptjs');
// const Otp = require('../models/otp');
const axios = require('axios');
const Token = require('../models/token');

let AccessLimit = (tokens) => {
  let length = tokens.length;
  if (length < process.env.MAXCONCURRENTLOGINS) {
    return true;
  } else {
    return false;
  }
};
const tokenGenerator = async (
  user,
  update = { check: false },
  resetTokens = false
) => {
  try {
    let accessExpiry = parseInt(process.env.ACCESSEXPIRY, 10); 
    let refreshExpiry = parseInt(process.env.REFRESHEXPIRY, 10);
    let access = jwt.sign(
        { id: user._id, type: 'access' }, 
        process.env.JWT_KEY, 
        { expiresIn: accessExpiry,}
      );
    let refresh = jwt.sign(
        { id: user._id, type: 'refresh' },
        process.env.JWT_KEY,
        { expiresIn: refreshExpiry }
    );

    let tokens = await Token.find({ user_id: user._id });

        if (resetTokens) {
          tokens.map(async (token) => {
        // console.log("deleting",token);
        await token.delete(); //reset all tokens
      });
    }

    if (update.check) {
      await tokens[update.index].updateOne({ //refresh token 
        access: access,
        refresh: refresh,
      });
    } 
    else {
      if (AccessLimit(tokens)) { //for multiple logins 
        let token = new Token({
          access: access,
          refresh: refresh,
          user_id: user._id,
        });
        await token.save();
      } else {
        // console.log("going here");
        await Promise.all(tokens.map(async(e)=>await e.delete())); // delete old tokens
        let token =new  Token({
          access: access,
          refresh: refresh,
          user_id: user._id,
        });
        // console.log("token",token);
        await token.save();
      }
    }

    return {
      access: {
        token: access,
        expiryin: accessExpiry,
      },
      refresh: {
        token: refresh,  
        expiryin: refreshExpiry,
      },
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};
const random = (length) => {
  let code = Math.random().toString().split('.')[1].slice(0, length);
  if (code.length !== length) {
    code = random;
  }
  return code;
};

const nseries = (length) => {
  arr = [];
  for (let i = 1; i <= length; i++) {
    arr.push(i);
  }
  return arr;
};

const makeRandom = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const message = (to, message, code) => {
  console.log(`${message} sent to ${to} via message`);
  var config = {
    method: 'get',
    url: `https://2factor.in/API/V1/f51a7acc-790a-11ec-b710-0200cd936042/SMS/${to}/${code}/Pupperazy`,
    headers: {},
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    });
};

const compareTime = (time1, time2, condition = 1) => {
  switch (condition) {
    case 1:
      return (new Date(time1) - new Date(time2)) / 1000;
  }
};

// const generateOTP = async (length, user) => {
//   try {
//     let code = random(length);
//     let validTill = moment
//         .tz(
//           new Date(Date.now() + process.env.OTPVALIDINMIN * 60000),
//           'ASIA/KOLKATA'
//         )
//         .toString();
//       let messageText = `${code} is the OTP for the action initiated at ${
//         process.env.PROJECTNAME
//       }, this code is valid till ${validTill
//         .split(' ')[4]
//         .slice(0, 5)}\n#HaveAGoodTime`;
//         let otp = await Otp.findOne({  user_id: user._id  });
//         if (otp) await otp.delete();
        
//         otp = new Otp({
//           user_id: user._id,
//           code: code,
//           valid_till: validTill,
//           message_sent_at: moment.tz(Date.now(), 'ASIA/KOLKATA').toString(),
//         });
//         console.log(otp);
//         await otp.save()
//         // if (!message(user.mobileNumber, messageText,code)) throw customError.serverDown;
//         return otp;
//     } catch (error) {
      
//     }
  
//   // sendMail(code, user.email, 'Email Otp');
// };

const hashPassword = async (password) => {
  return await bcrypt.hash(password, bcrypt.genSaltSync(8));
};

const sendMail = async (otp, to, subject) => {
  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  data = await ejs.renderFile(__dirname + '/test.ejs', {
    otp: otp,
  });

  var mailOptions = {
    from: process.env.MAIL_FROM,
    to: to,
    subject: subject,
    html: data,
    replyTo: process.env.REPLY_TO,
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
};

function sendRequest(payload = {}, header = {}, url, method = 'GET') {
  // var data = JSON.stringify(payload);
  var data = payload;

  var config = {
    method: method,
    url: url,
    headers: {...header,'Content-Type': 'application/json'},
    data: data,
  };
  // console.log(config);
  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // console.log('error', error.response.data.error);
      // console.log(error.response.data.error.status);
      return error.response.data;
    });
}

const verifyPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

module.exports = {
  tokenGenerator,
  random,
  makeRandom,
  message,
  compareTime,
  // generateOTP,
  nseries,
  hashPassword,
  sendMail,
  verifyPassword,
  sendRequest,
};
