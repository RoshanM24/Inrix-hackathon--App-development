const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    username: {
      type: String,
      unique:true,
    },
    mobileNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    fuelType:{
      type:String,
    },
    carType:{
      type:String,
    },
    licensePlate:{
      type:String,
    },
    carbonFootPrint:{
      type:Number,
      default:0
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('user', UserSchema);
