const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema ({
    Saddress:String,
    Raddress:String,
    Pkey:String,
    Amount:Number,
    Txid:{type:String},
    Ethaddress:String,
    email:String,
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    } 
    
});

module.exports = mongoose.model('Transaction',TransactionSchema); 
