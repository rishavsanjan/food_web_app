const express=require('express');
const prisma = require('../config/db');

const userRoute=express.Router();

userRoute.get('/',async(req,res)=>{
    const u=await prisma.users.findMany()
    res.json(u)
})

module.exports=userRoute