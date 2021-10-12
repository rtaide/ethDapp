const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path'); 
const app = express();

const transaction = require("./routes/routes");
const methodOverride = require('method-override');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.use(express.json({ limit: "50mb" }));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(transaction);

mongoose.connect('mongodb://localhost:27017/ethdapp',{
    useNewUrlParser:true,
    //useCreateIndex:true,                 
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected")
}).catch(err=>{
    console.log("err0r while connecting")
})

app.listen(3000, () => {
    console.log("Listening on port 3000 " );
});