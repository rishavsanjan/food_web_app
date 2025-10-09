const express = require('express');
const prisma = require('../config/db');
const { createUserSchema, loginUserSchema, updateAddress, updateTransaction, reviewSchema } = require('../zodType');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authMid, userAuthMid } = require('../middlewares/auth');


const userRoute = express.Router();

userRoute.get('/', (req, res) => {
    // const u=await prisma.users.findMany()
    return res.json({ msg: "Hello from user" })
})

userRoute.post('/signup', async (req, res) => {
    const p = createUserSchema.safeParse(req.body);
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }
    const hpass = await bcrypt.hash(p.data.password, 10)
    try {
        const result=await prisma.$transaction(async(tx)=>{
            const user = await tx.users.create({
                data: {
                    name: p.data.name,
                    email: p.data.email,
                    phone_number: p.data.phone_number,
                    address: p.data.address,
                    password: hpass,
                    role: p.data.role,
                    city:p.data.city
                }
            })
            if (p.data.role == 'RESTAURANT_OWNER') {
                const rest = await tx.restaurant.create({
                    data: {
                        restaurant_name: p.data.restaurant_name,
                        restaurant_address: p.data.address,
                        city: p.data.city,
                        user_id: user.user_id,
                        rating: p.data.rating
                    }
                })
                return { success: true, restaurantCreated: true }
            }
            if(p.data.role==='DELIVERY_AGENT'){
                await tx.delivery_agent.create({
                    data:{
                        agent_name:p.data.name,
                        vehicle:p.data.vehicle,
                        rating:p.data.rating,
                        user_id:user.user_id
                    }
                })
            }
            return { success: true, restaurantCreated: false }
        })
        return res.json({ success: true, msg: "user created" })
    } catch (error) {
        // console.log(error)
        return res.status(403).json({ msg: "Either user alredy exist or there is a server problem", success: false })
    }
})

userRoute.post('/login', async (req, res) => {
    const p = loginUserSchema.safeParse(req.body)
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }

    try {
        const user = await prisma.users.findUnique({
            where: {phone_number: p.data.phone_number}
        })
        if (!user) {
            return res.status(401).json({ msg: "user not found", success: false })
        }
        const match = await bcrypt.compare(p.data.password, user.password)
        if (!match) {
            return res.status(401).json({ msg: "mismatch password", success: false })
        }
        const userinfo={
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address,
            city:user.city
        }
        const token = jwt.sign({ user_id: user.user_id, role: user.role, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return res.json({ msg: token,user:userinfo, success: true,role:user.role})
    } catch (error) {
        console.log(error)
        return res.status(403).json({ msg: "there is a server problem", success: false })
    }
})

userRoute.get('/profile', authMid, async (req, res) => {
    try {
        const currentUser = await prisma.users.findUnique({
            where: {
                user_id: req.user.user_id
            },
            select:{
                user_id:true,
                name:true,
                address:true,
                phone_number:true,
                email:true,
                city:true,
                role:true
            }
        })
        return res.json({ success: true, user: currentUser })
    } catch (error) {
        // console.log(error);
        return res.status(403).json({ msg: "there is a server problem", success: false })
    }


})

userRoute.get('/getRest', authMid, userAuthMid, async (req, res) => {
    try {
        const customerCity = await prisma.users.findFirst({
            where: { user_id: req.user.user_id },
            select: { city: true }
        })
        const rest = await prisma.restaurant.findMany({
            where: { city: customerCity.city }
        })
        return res.json({ success: true, data: rest })
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", success: false });
    }
})

userRoute.post('/updateAdd',authMid,userAuthMid,async(req,res)=>{
    const p=updateAddress.safeParse(req.body)
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }
    try {
        await prisma.users.update({
            where:{user_id:req.user.user_id},
            data:p.data
        })
        return res.json({success:true,mag:"user address updated"})
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", success: false });
    }
})


userRoute.get('/rest/menus/:id',authMid,userAuthMid,async(req,res)=>{
    try {
        const userId = req.user.user_id;
        const rest=await prisma.restaurant.findUnique({
            where:{id_restaurant:parseInt(req.params.id)},
            select:{
                id_restaurant:true,
                restaurant_name:true,
                rating:true,
                image:true,
                restaurant_address:true,
                menu:true,
                review:{
                    where:{
                        user_id:{not:userId}
                    },
                    select:{
                        rating:true,
                        review_text:true,
                        review_id:true,
                        created_at:true,
                        users:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            },
            
        })
        const userReview=await prisma.review.findFirst({
            where:{
                user_id:req.user.user_id,
                id_restaurant:rest.id_restaurant
            }
        })
        // console.log(userReview)
        const restaurant={
            id_restaurant:rest.id_restaurant,
            restaurant_name:rest.restaurant_name,
            rating:rest.rating,
            image:rest.image,
            restaurant_address:rest.restaurant_address,
        }
        // const vegMenus = rest.menu.filter(menu => menu.category === 'veg');
        // const nonVegMenus =rest.menu.filter(menu => menu.category === 'non_veg');
        // console.log(vegMenus)
        return res.json({success:true,restaurant,menus:rest.menu,reviews:rest.review,userReview})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal server error", success: false });
    }
})


userRoute.patch('/update-transaction/:orderId', authMid,userAuthMid, async (req, res) => {
  const { orderId } = req.params;
  const p=updateTransaction.safeParse(req.body)
  console.log(req.body)
  if (!p.success) {
      return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }
    // const { transaction_id, payment_status } = req.body;

  try {
    // Update only the payment record for this order with status 'pending'
    const payment = await prisma.payments.updateMany({
      where: {
        order_id: parseInt(orderId, 10),
        payment_status: 'pending'||'cod_pending', // only update pending payments
      },
      data: {
        transaction_id:p.data.transaction_id,
        payment_status:p.data.payment_status,
        payment_time: new Date(),
      },
    });

    if (payment.count === 0) {
      return res.status(404).json({
        success: false,
        msg: 'No pending payment record found for this order',
      });
    }

    return res.json({
      success: true,
      msg: 'Payment updated successfully',
      updatedCount: payment.count,
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    return res.status(500).json({ success: false, msg: 'Internal server error' });
  }
});

userRoute.post('/review',authMid,userAuthMid,async(req,res)=>{
    const p=reviewSchema.safeParse(req.body)
    console.log(p)
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }
    try {
        const ratingup=await prisma.$transaction(async(tx)=>{
            await tx.review.upsert({
                where:{
                    user_id_id_restaurant:{
                        user_id:req.user.user_id,
                        id_restaurant:p.data.id_restaurant
                    }
                },
                create:{
                    user_id:req.user.user_id,
                    id_restaurant:p.data.id_restaurant,
                    rating:p.data.rating,
                    review_text:p.data.review
                },
                update:{
                    rating:p.data.rating,
                    review_text:p.data.review
                }
            })
            const agg=await tx.review.aggregate({
                where:{id_restaurant:p.data.id_restaurant},
                _avg:{rating:true}
            })
            const avgRate=agg._avg.rating??0
            await tx.restaurant.update({
                where:{id_restaurant:p.data.id_restaurant},
                data:{rating:avgRate}
            })
            return avgRate
        })
        res.json({success:true,msg:"Review submitted and restaurant rating updated",new_average_rating:ratingup})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, msg: 'Server error' });
    }
})


userRoute.get('/:restid/reviews',authMid,userAuthMid,async(req,res)=>{})


userRoute.get('/getReview/:id',authMid,userAuthMid,async(req,res)=>{
    try {
        const review=await prisma.review.findUnique({
            where:{
                user_id_id_restaurant:{
                    user_id:req.user.user_id,
                    id_restaurant:parseInt(req.params.id)
                }
            }
        })
        return res.json({success:true,review})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, msg: 'Server error' });
    }
})

module.exports = userRoute