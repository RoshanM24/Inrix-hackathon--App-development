const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = Schema({
    tripId:{
        type:String,
        required:true,
    },
    tripInfo:{
        type:Object,
        required:true,
    },
    carbonFootprint:{
        type:Number,
        require:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        require:true,
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

module.exports = mongoose.model('trip',TripSchema);