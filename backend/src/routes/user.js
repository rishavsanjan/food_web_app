const express=require('express');
const prisma = require('../config/db');
const { createUserSchema, loginUserSchema } = require('../zodType');
const bcrypt=require('bcryptjs');
const jwt= require('jsonwebtoken')

const userRoute=express.Router();

userRoute.get('/',(req,res)=>{
    // const u=await prisma.users.findMany()
    return res.json({msg:"Hello from user"})
})

userRoute.post('/signup',async(req,res)=>{
    const p=createUserSchema.safeParse(req.body);
    if(!p.success){
        return res.status(400).json({"msg":"Invalid format or less info","success":false})
    }
    const hpass=await bcrypt.hash(p.data.password,10)
    try {
        const user=await prisma.users.create({
            data:{
                name:p.data.name,
                email:p.data.email,
                phone_number:p.data.phone_number,
                address:p.data.address,
                password:hpass,
                role:p.data.role
            }
        })
        return res.json({success:true,msg:user})
    } catch (error) {
        return res.status(403).json({msg:"Either user alredy exist or there is a server problem",success:false})
    }
})

userRoute.post('/login',async(req,res)=>{
    const p=loginUserSchema.safeParse(req.body)
    if(!p.success){
        return res.status(400).json({"msg":"Invalid format or less info","success":false})
    }
    try {
        const user=await prisma.users.findFirst({where:{
            OR:[
                {email:p.data.email},
                {phone_number:p.data.phone_number}
            ]
        }})
        if(!user){
            return res.status(401).json({msg:"user not found",success:false})
        }
        const match=await bcrypt.compare(p.data.password,user.password)
        if(!match){
            return res.status(401).json({msg:"mismatch password",success:false})
        }
        const token=jwt.sign({user_id:user.user_id,role:user.role,iat: Math.floor(Date.now() / 1000)},process.env.JWT_SECRET,{expiresIn:"7d"})
        return res.json({msg:token,success:true})
    } catch (error) {
        
    }
})

module.exports=userRoute