const express=require('express')
const { authMid, agentAuthMid } = require('../middlewares/auth')
const prisma = require('../config/db')
const { agentStatusSchema, orderStatusSchema } = require('../zodType')

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
        return res.json({msg:"status updated",success:true})
    } catch (error) {
        res.status(500).json({msg:"Internal server error",success:false});
    }
})


agentRoute.post('/assignorder',authMid,agentAuthMid,async(req,res)=>{
    if(!req.body.order_id||!req.body.delivery_address||!req.body.restaurant_address){
        return res.status(400).json({"msg":"Invalid format or less info","success":false})
    }
    try {
        const agent=await prisma.delivery_agent.findUnique({
            where:{user_id:req.user.user_id}
        })
        const delivery =await prisma.deliveries.create({
            data:{
                order_id:req.body.order_id,
                delivery_agent_id:agent.agent_id,
                delivery_address:req.body.delivery_address,
                restaurant_address:req.body.restaurant_address
            }
        })
        return res.json({msg:"agent assigned",success:true})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Internal server error",success:false});
    }
})

agentRoute.patch('/change-order-status',authMid,agentAuthMid,async(req,res)=>{
    const p=orderStatusSchema.safeParse(req.body)
    if(!p.success){
        return res.status(400).json({"msg":"Invalid format or less info","success":false})
    }
    try {
        const agent=await prisma.delivery_agent.findUnique({
            where:{user_id:req.user.user_id}
        })
        const updateData = {
            delivery_status: p.data.status
        };

        if (p.data.status === 'picked_up') {
            updateData['picked_at'] = new Date(); 
        }
        if (p.data.status === 'delivered') {
            updateData['delivered_at'] = new Date(); 
        }
        await prisma.$transaction(async(tx)=>{
            const deliveryst=await tx.deliveries.update({
                where:{order_id:p.data.order_id,delivery_agent:agent.agent_id},
                data:updateData
            })
            if(p.data.status==='picked_up'){
                await tx.orders.update({
                    where:{order_id:p.data.order_id},
                    data:{status:'Out_for_Delivery'}
                })
            }
            if(p.data.status==='delivered'){
                await tx.orders.update({
                    where:{order_id:p.data.order_id},
                    data:{status:'Delivered'}
                })
            }
        })
        return res.json({msg:"status updated",success:true})
    } catch (error) {
        res.status(500).json({msg:"Internal server error",success:false});
    }
})


module.exports={agentRoute}