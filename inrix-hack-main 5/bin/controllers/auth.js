const customError = require('../custom/customError');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Tokens = require('../models/token');
const moment = require('moment-timezone');
const { tokenGenerator, hashPassword, verifyPassword, compareTime } = require('../custom/auxiliary');


exports.registerUser = async (req, res) => {
  try {
    let body = req.body;
    if (!body.email || !body.mobileNumber || !body.username || !body.password || !body.fuelType || !body.carType || !body.licensePlate)
      throw customError.dataInvalid;

    let user = await User.findOne({ username : body.username });
    if (user) throw customError.userExists;
    let pass = await hashPassword(body.password);
    user = new User({
      username: body.username,
      password: pass,
      email:body.email,
      mobileNumber:body.mobileNumber,
      licensePlate:body.licensePlate,
      carType:body.carType,
      fuelType:body.fuelType,
    });
    user = await user.save();


    res.status(200).json({
      success: true,
      data: user,
      message: 'User Created',
    });

  } catch (error) {

    console.log(`***** ERROR : ${req.originalUrl} ${error}`);
    return res.status(200).json({
      success: false,
      data:error,
    });

  }
};

exports.loginOrSignUpUser = async (req,res)=>{
    try{
        let body = req.body;
        if (!body.username || !body.password) throw customError.dataInvalid;
        let user= await User.findOne({username:body.username})
        if(!(await verifyPassword(user, body.password))) throw customError.authFailed;
        res.status(200).json({
            success: true,
            token: await tokenGenerator(user),
            data:user,
            message:`Logged In Successfully`,
        });

    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl,error} error`);
        res.status(200).json({
            success: false,
            data:error,
        });
    }
}

exports.refresh = async (req, res) => {
  try {
    let access = req.body.access,
      refresh = req.body.refresh;
    console.log(access,refresh);
    if (!access || !refresh) throw customError.dataInvalid;
    let decodedRefresh = jwt.verify(refresh, process.env.JWT_KEY),
      valid = false;
    // console.log(decodedRefresh);
    req.user = await User.findOne({ _id: decodedRefresh.id });
    // console.log(req.user,"user");
    let tokens = await Tokens.find({ user_id: req.user._id });
    let ind;
    tokens.forEach((token, i) => {
      if (access == token.access && token.refresh == refresh) {
        ind = i;
        return (valid = true);
      }
    });
    if (!valid) throw customError.authFailed;
    res.status(200).json({
      success: true,
      data: {
        message: 'Token Refreshed Sucessfully!',
        token: await tokenGenerator(req.user,false,true),
      },
    });
  } catch (error) {
    console.log(`***** ERROR : ${req.originalUrl} ${error}`);
    return res.status(error.code || 401).json({
      success: false,
      data: error || {
        code: 401,
        name: 'Authorization Failed! - Devloper Defined Error!',
        message: "Uh oh! i can't tell you anymore #BruteForcers! alert",
      },
    });
  }
};

exports.verifyToken = async (req, res, next) =>{
  try{
    if (!req.headers.authorization) throw customError.authFailed;
    let access = req.headers.authorization.split(' ')[1];
    let  decodedUser = jwt.verify(access, process.env.JWT_KEY);
    let  valid = false;
    let tokens = await Tokens.find({user_id:decodedUser.id});
    tokens.forEach((token) => {
      if (access == token.access && compareTime(moment.tz(Date.now(), 'ASIA/KOLKATA'),decodedUser.exp *1000)<0) return (valid = true);
    });
    if (!valid) throw customError.authFailed;
    req.user_id = decodedUser.id;
    // next();
    res.status(200).json({
      success: true,
      // data: user,
      message: 'Token Verfied',
    });


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