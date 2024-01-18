const mongoose = require('mongoose');
mongoose.pluralize(null);
mongoose.connect(process.env.DB_CONNECTION_URL,{useNewUrlParser:true});
module.exports = mongoose.connection; 