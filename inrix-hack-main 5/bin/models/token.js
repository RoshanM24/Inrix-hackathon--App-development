const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = Schema({
    access:{
        type:String,
        required:true,
    },
    refresh:{
        type:String,
        required:true,
    },
    user_id:{
        type:Schema.Types.ObjectId,
        require:true,
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

module.exports = mongoose.model('token',TokenSchema);