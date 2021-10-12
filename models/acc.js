const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema ({
    ethAdd:String,
    privatekey:String,
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    } 
    
});

module.exports = mongoose.model('Account',AccountSchema); 
