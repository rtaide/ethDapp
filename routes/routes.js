var express = require("express");
const {getBalance, sendTransaction} = require("../controllers/sendTransaction");
const {register, login, update, del,ethacc,getacc,validate,forgot,reset, resetPassword} = require("../controllers/register");
const User = require("../models/user");
var router = express.Router();


router.get("/",async(req,res)=>{
    res.send("welcome")
})

router.get("/register",async(req,res)=>{
    res.render("register.ejs");
})

router.get('/register/:id/edit', async(req,res)=>{
    const user = await User.findById(req.params.id);
    res.render('edit',{user});
    //res.send("edit");
})  

router.post("/register",register);
router.post("/login",login);
router.put("/register/:id",update);
router.delete("/register/:id",del);
router.get("/:id/getacc",getacc)
router.post("/:id/ethacc",ethacc);
router.get("/:id/balance",getBalance);
router.post("/sendtrx",sendTransaction);
router.post("/validate/:id",validate);
router.post("/:userId/forgot-password",forgot);
router.get("/:userId/reset-password",reset);
router.post("/:userId/reset-password",resetPassword);

module.exports=router;