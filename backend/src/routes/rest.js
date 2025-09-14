const express=require('express');
const prisma = require('../config/db');
const { authMid, restAuthMid } = require('../middlewares/auth');
const { createMenuSchema, updateMenuSchema } = require('../zodType');

const restRoute=express.Router();

restRoute.get("/menu",authMid,restAuthMid,async(req,res)=>{
    try {
        const menu=await prisma.restaurant.findUnique({
            where:{user_id:req.user.user_id},
            // include:{menu:true},
            select:{
                menu:true,
                id_restaurant:true,
                restaurant_name:true,
                rating:true,
                image:true,
                restaurant_address:true
            }
        });
        const restaurant={
            id_restaurant:menu.id_restaurant,
            restaurant_name:menu.restaurant_name,
            rating:menu.rating,
            image:menu.image,
            restaurant_address:menu.restaurant_address,
        }
        return res.json({menus:menu.menu,restaurant,success:true})
    } catch (error) {
        res.status(500).json({msg:"Internal server error",success:false});
    }
})

restRoute.post("/addMenu",authMid,restAuthMid,async(req,res)=>{
    const d=createMenuSchema.safeParse(req.body)
    // console.log(d)
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
        return res.json({success:true,msg: "Menu item added"});
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Internal server error",success:false});
    }
})

restRoute.patch("/menuUpdate",authMid,restAuthMid,async(req,res)=>{
    const d=updateMenuSchema.safeParse(req.body)
    if(!d.success){
        return res.status(400).json({"msg":"Invalid format or less info","success":false})
    }
    try {
        const rest=await prisma.restaurant.findUnique({
            where:{user_id:req.user.user_id},
            select:{id_restaurant:true}
        })
        const menu=await prisma.menu.findFirst({
            where:{menu_id:d.data.menu_id,id_restaurant:rest.id_restaurant}
        })
        if(!menu){
            return res.status(404).json({success:false,msg:"Menu item not found or does not belong to your restaurant"});
        }
        const updateMenu=await prisma.menu.update({
            where:{menu_id:d.data.menu_id},
            data:d.data
        })
        return res.json({success:true,msg:"Menu updated",menu:updateMenu});
    } catch (error) {
        res.status(500).json({msg:"Internal server error",success:false});
    }
})

restRoute.patch("/menu/avail/:id",authMid,restAuthMid,async(req,res)=>{
    try {
        const menuId=parseInt(req.params.id);
        const {availability}=req.body;

        if (typeof availability!=='boolean') {
            return res.status(400).json({success:false,msg:"Invalid availability value"});
        }
        const restaurant=await prisma.restaurant.findUnique({
            where: {user_id:req.user.user_id},
            select: {id_restaurant: true}
        });
        const menuItem=await prisma.menu.findFirst({
            where: {
                menu_id: menuId,
                id_restaurant: restaurant.id_restaurant
            }
        });

        if(!menuItem){
            return res.status(404).json({success:false,msg:"Menu item not found or does not belong to your restaurant" });
        }

        const updatedMenu=await prisma.menu.update({
            where:{menu_id:menuId},
            data:{availability}
        });
        return res.json({success:true,msg:"Availability updated",menu:updatedMenu});
    } catch (error) {
        res.status(500).json({msg:"Internal server error",success:false});
    }
})

restRoute.get('/orders',authMid,restAuthMid,async(req,res)=>{
    try {
        const restaurant=await prisma.restaurant.findUnique({
            where: {user_id:req.user.user_id},
            select: {id_restaurant: true}
        });
        const orders=await prisma.orders.findMany({
            where:{
                id_restaurant:restaurant.id_restaurant,
                status:'Preparing',
                payments:{
                    some:{
                        payment_status:{
                            in:['completed','cod_pending']
                        }
                    }
                }
            },
            select:{
                order_details:{
                    select:{
                        menu:{
                            select:{
                                menu_name:true
                            }
                        },
                        quantity:true,
                        total_price:true
                    }
                },
                order_id:true,
                status:true,
                order_time:true
            },
        })
        return res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Internal server error",success:false});
    }
})



module.exports=restRoute