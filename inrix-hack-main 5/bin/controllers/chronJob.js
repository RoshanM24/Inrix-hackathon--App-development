const schedule = require('node-schedule');
const moment = require('moment-timezone');
const { sendRequest } = require('../custom/auxiliary');



const InrixTokenChron = schedule.scheduleJob('0 0 0 * * *', async function(){
// const autoLive = schedule.scheduleJob('1 * * * *', async function(){
  try {
    console.log("autoLive called");
    const url = `${process.env.INRIX_API}auth/v1/appToken?appId=${process.env.INRIX_APP_ID}&hashToken=${process.env.INRIX_HASH_TOKEN}`
    const res =  await sendRequest({},{},url,"GET");
    global.inrixtoken = res.result.token
    console.log(res);
  } catch (error) {
      console.log('in error of autoLive scheduler');
      console.log(error);
  }
  
})