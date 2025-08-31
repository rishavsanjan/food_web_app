const express=require('express');
const prisma = require('../config/db');

const restRoute=express.Router();

restRoute.get("/",async(req,res)=>{
    const r=await prisma.restaurant.findMany();
    res.json(r)
})

module.exports=restRoute