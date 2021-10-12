const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const User = require("../models/user");
const Account = require("../models/acc");

const register =async (req,res)=>{
    try {
        const { first_name, last_name, email, password,eth_add } = req.body;   
        //res.send(req.body);
        // Validate user input
        if (!(email && password && first_name && last_name && eth_add)) {
          res.send("All input is required");
          return res.status(400).send("All input is required");
        }
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });
        if (oldUser) {
          res.send("User Exist");
          console.log("User Exist");
          //return res.status(409).send("User Already Exist. Please Login");
        }
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
        const secret = speakeasy.generateSecret();
        // Create user in our database
        const user = await User.create({
          first_name,
          eth_add,
          last_name,
          email: email.toLowerCase(),
          password: encryptedPassword,
          googauthtoken: secret.base32
        });
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          //process.env.TOKEN_KEY,
          'rtatrartartatrattatar',
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;
    
        // return new user
        //return res.status(201).json(user);
        res.redirect(`/register/${user._id}`);
        //res.redirect(`/register/${register._id}`);
      } catch (err) {
        console.log(err);
      }
      
}

const login = async(req,res)=>{
    try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          return res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            //process.env.TOKEN_KEY,
            'rtatrartartatrattatar',
            {
              expiresIn: "2h",
            }
          );
          // save user token
          user.token = token;
          // user
          //return res.status(200).json(user);
         return  res.render("balance.ejs")
        }
       return res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }
}

const update = async(req,res)=>{
  const {id} = req.params;
  const user =await User.findByIdAndUpdate(id,{...req.body.user});
  res.redirect(`/register/${user._id}`);

}

const del = async(req,res)=>{
  const {id} = req.params;
    await User.findByIdAndDelete(id);
    res.redirect(`/register`);
}
const getacc = async(res,req)=>{
  try{
    const user = await User.findOne({_id:req.params.id}).populate("acc");
    res.json({Accounts:user});
  }catch(err){
    res.json({err});
  }
}

const ethacc = async(req,res)=>{
  try{
  const user = await User.findById(req.params.id);
  const createEthacc =await web3.eth.accounts.create();
  const newAccount = new Account({
    ethAdd:createEthacc.address,
    privatekey:createEthacc.privatekey,
    user:user._id
  });
  const account = await newAccount.save()
  user.accounts.push(account._id);
  await user.save();
  res.json({user});
}catch(err){
  res.json({err});
}
}

const validate = async (req,res)=>{
    const {token} =req.body;
    try{
         User.findById(req.params.id).exec((err, user) => {
            if (err) {
                res.json(err);
            } else {
  
                const base32secret = user.googauthtoken;
  
                const validate = speakeasy.totp.verify({
                    secret: base32secret,
                    encoding: 'base32',
                    token: token
                });
                if (validate) {
                    res.json({ verified: true })
                } else {
                    res.json({ verified: false });
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error ret user' })
    }
    }


module.exports ={register, login, update, del, ethacc, getacc, validate};