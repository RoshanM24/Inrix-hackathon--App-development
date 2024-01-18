const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const { compareTime } = require('../custom/auxiliary');

const customError = require('../custom/customError');
// const User = require('../models/user');
const Tokens = require('../models/token');

// exports.checkCustomer = async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) throw customError.authFailed;
//     let access = req.headers.authorization.split(' ')[1],
//       decodedUser = jwt.verify(access, process.env.JWT_KEY),
//       valid = false;

//     req.user = await User.findOne({
//       where: { id: decodedUser.id, status: 'verified', role: 'customer' },
//     });
//     tokens = await Tokens.findAll({ where: { user_id: req.user.id } });
//     tokens.forEach((token) => {
//       if (access == token.access) return (valid = true);
//     });
//     if (!valid) throw customError.authFailed;
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(error.code || 401).json({
//       success: false,
//       details: {
//         code: error.code || 401,
//         name: error.name || 'Authorization Failed!',
//         message: `Uh oh! i can't tell you anymore #BruteForcers! alert`,
//       },
//     });
//   }
// };

// exports.checkAdmin = async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) throw customError.authFailed;
//     let access = req.headers.authorization.split(' ')[1],
//       decodedUser = jwt.verify(access, process.env.JWT_KEY),
//       valid = false;

//     req.user = await User.findOne({
//       where: { id: decodedUser.id, role: 'admin' },
//     });
//     tokens = await Tokens.findAll({ where: { user_id: req.user.id } });
//     tokens.forEach((token) => {
//       if (access == token.access) return (valid = true);
//     });
//     if (!valid) throw customError.authFailed;

//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(error.code || 401).json({
//       success: false,
//       details: {
//         code: error.code || 401,
//         name: error.name || 'Authorization Failed!',
//         message: `Uh oh! i can't tell you anymore #BruteForcers! alert`,
//       },
//     });
//   }
// };

exports.verifyToken = async (req, res, next) =>{
  try{
    if (!req.headers.authorization) throw customError.authFailed;
    let access = req.headers.authorization.split(' ')[1];
    console.log(access);
    let  decodedUser = jwt.verify(access, process.env.JWT_KEY);
    // console.log(decodedUser)
    let  valid = false;
    let tokens = await Tokens.find({user_id:decodedUser.id});
    tokens.forEach((token) => {
      if (access == token.access && compareTime(moment.tz(Date.now(), 'ASIA/KOLKATA'),decodedUser.exp *1000)<0) return (valid = true);
    });
    if (!valid) throw customError.authFailed;
    req.user_id = decodedUser.id;
    next();

  } catch (error) {
    console.log(error);
    return res.status(error.code || 401).json({
      success: false,
      details: {
        code: error.code || 401,
        name: error.name || 'Authorization Failed!',
        message: `Uh oh! i can't tell you anymore #BruteForcers! alert`,
      },
    });
  }
}