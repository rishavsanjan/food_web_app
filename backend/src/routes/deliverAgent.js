const express=require('express')
const { authMid, agentAuthMid } = require('../middlewares/auth')
const prisma = require('../config/db')
const { agentStatusSchema } = require('../zodType')

const agentRoute=express.Router()

agentRoute.patch('/change-status',authMid,agentAuthMid,async(req,res)=>{
    const p=agentStatusSchema.safeParse(req.body)
    if(!p.success){
        return res.status(400).json({"msg":"Invalid format or less info","success":false})
    }
    try {
        await prisma.delivery_agent.update({
            where:{user_id:req.user.user_id},
            data:{status:p.data.status}
        })
    } catch (error) {
         res.status(500).json({msg:"Internal server error",success:false});
    }
})


module.exports={agentRoute}