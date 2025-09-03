const express=require('express');
const prisma = require('../config/db');
const { authMid, restAuthMid } = require('../middlewares/auth');
const { createMenuSchema } = require('../zodType');

const restRoute=express.Router();

restRoute.get("/menu",authMid,restAuthMid,async(req,res)=>{
    try {
        const menu=await prisma.restaurant.findMany({
            where:{user_id:req.user.user_id},
            // include:{menu:true},
            select:{menu:true}
        });
        return res.json({data:menu,success:true})
    } catch (error) {
        res.status(500).json({msg:"Internal server error",success:false});
    }
})

restRoute.post("/addMenu",authMid,restAuthMid,async(req,res)=>{
    const d=createMenuSchema.safeParse(req.body)
    if(!d.success){
        return res.status(400).json({"msg":"Invalid format or less info","success":false})
    }
    try {
        const rest=await prisma.restaurant.findUnique({
            where:{user_id:req.user.user_id},
            select:{id_restaurant:true}
        })

        // TODO: add image link
        const menu=await prisma.menu.create({
            data:{
                id_restaurant:rest.id_restaurant,
                menu_name:d.data.menu_name,
                description:d.data.description,
                category:d.data.category,
                calories:d.data.calories,
                price:d.data.price,
                protein:d.data.protein,
                fat:d.data.fat,
                fiber:d.data.fiber,
                carbohydrates:d.data.carbohydrates,
                cholesterol:d.data.cholesterol,
                availability:d.data.availability
            }
        })
        return res.json({ success: true, msg: "Menu item added", menu });
    } catch (error) {
        res.status(500).json({msg:"Internal server error",success:false});
    }
})

restRoute.patch("/menu/avail/:id",authMid,restAuthMid,async(req,res)=>{
    try {
        const menuId = parseInt(req.params.id);
        const { availability } = req.body;

        if (typeof availability !== 'boolean') {
            return res.status(400).json({ success: false, msg: "Invalid availability value" });
        }
        const restaurant = await prisma.restaurant.findUnique({
            where: { user_id: req.user.user_id },
            select: { id_restaurant: true }
        });
        const menuItem = await prisma.menu.findFirst({
            where: {
                menu_id: menuId,
                id_restaurant: restaurant.id_restaurant
            }
        });

        if (!menuItem) {
        return res.status(404).json({ success: false, msg: "Menu item not found or does not belong to your restaurant" });
        }

        // Update the availability
        const updatedMenu = await prisma.menu.update({
        where: { menu_id: menuId },
        data: { availability }
        });
        return res.json({ success: true, msg: "Availability updated", menu: updatedMenu });
    } catch (error) {
        res.status(500).json({msg:"Internal server error",success:false});
    }
})

module.exports=restRoute