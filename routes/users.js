const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');
//User model
const User=require('../models/User');


//Login page
router.get('/login', (req, res)=> res.render('login'));//render to login.ejs
//Register page
router.get('/register', (req, res)=> res.render('register'));//render to register.ejs

//Register Handle
router.post('/register', (req, res)=>{
    /*console.log(req.body)
    res.send('hello');*/
    const{ name, email, password, password2 }=req.body;
    let errors=[];
    //check required field
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in all fields'});
    }
    //check passwords match
    if(password != password2){
        errors.push({ msg: 'Passwords do not match'});
    }
    //check pass length
    if(password.length<6){
        errors.push({ msg: 'Password should be least 6 characters'});
    }
    //passing all datas
    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });

    }else{
        //Validation passed
        //check if email equals email, email variable is passed in register form
        User.findOne({ email: email})
        .then(user =>{
            if(user){
                //User exists
                errors.push({msg: 'Email is already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser=new User({
                    name,
                    email,
                    password
                });

                /*console.log(newUser)
                res.send('hello');*/
                
                //Hash Password
                bcrypt.genSalt(10, (err, salt)=>
                    bcrypt.hash(newUser.password, salt, (err, hash)=> {
                        if(err)throw err;
                        //Set password to hashed
                        newUser.password=hash;
                        //Save user//creating flash msg
                        newUser.save()
                            .then(user=>{
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err=>console.log(err));

                }))

            }
        });

    }

});
//Login Handle
router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash:true
    })(req, res, next);
});

//Logout Hadle
router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports=router;
