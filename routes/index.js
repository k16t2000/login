const express=require('express');
const router=express.Router();
const { ensureAuthenticated }=require('../config/auth');

//Welcome Page
router.get('/', (req, res)=> res.render('welcome'));//render view welcome.ejs
//Dashboard
router.get('/dashboard',ensureAuthenticated, (req, res)=> res.render('dashboard',{ name: req.user.name}));//render view dashboard.ejs
module.exports=router;