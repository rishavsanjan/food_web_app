const express = require('express')

const { authMid, userAuthMid } = require('../middlewares/auth')
const prisma = require('../config/db')
const { orderSchema } = require('../zodType')
const { success } = require('zod')

const orderRoute = express.Router()

orderRoute.get("/detail/:id", authMid, userAuthMid, async (req, res) => {
    try {
        const order = await prisma.orders.findUnique({
            where: { order_id: parseInt(req.params.id), user_id: req.user.user_id },
            include: {
                restaurant: true,
                order_details: {
                    include: { menu: true }
                }
            }
        })
        if (!order) { return res.status(404).json({ msg: "Order not found", success: false }) }
        return res.json({ order, success: true })

    } catch (error) {
        res.status(500).json({ msg: "Internal server error", success: false });
    }
})


orderRoute.get("/list", authMid, userAuthMid, async (req, res) => {
    const user_id = req.user.user_id
    try {
        const orders = await prisma.orders.findMany({
            where: { user_id },
            include: {
                restaurant: true,
                order_details: {
                    include: {
                        menu: true
                    }
                }
            }
        })
        res.json({ orders, success: true })
    } catch (error) {
        res.status(500).json({ msg: error, success: false });
    }
})


orderRoute.post("/create", authMid, userAuthMid, async (req, res) => {
    const p = orderSchema.safeParse(req.body)
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }
    try {
        // ToDo: add status to resturant to check online or offline then move forward
        const data = p.data
        const user_id = req.user.user_id
        const menuItems = await prisma.menu.findMany({ where: { menu_id: { in: data.items.map(i => i.menu_id) } } })
        if (menuItems.length !== data.items.length) {
            return res.status(400).json({ error: "Some menu items not found" });
        }
        let totalprice = 0
        data.items.forEach(item => {
            const menu = menuItems.find(m => m.menu_id === item.menu_id)
            totalprice += menu.price * item.quantity
        })
        // const order=await prisma.orders.create({data:{
        //     user_id:user_id,
        //     id_restaurant:data.id_restaurant,
        // }})
        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.orders.create({
                data: {
                    user_id: user_id,
                    id_restaurant: data.id_restaurant,
                    instruction: data.instruction
                }
            });
            const orderDetails = data.items.map(item => {
                const menu = menuItems.find(m => m.menu_id === item.menu_id)
                return {
                    order_id: order.order_id,
                    menu_id: item.menu_id,
                    quantity: item.quantity,
                    base_price: menu.price,
                    total_price: menu.price * item.quantity
                }
            })
            await tx.order_details.createMany({ data: orderDetails });
            await tx.payments.create({
                data: {
                    user_id,
                    order_id: order.order_id,
                    method: data.payment_method,
                    price: totalprice,
                    payment_status: 'completed'
                }
            });
            return { order, orderDetails };
        });
        // await prisma.order_details.createMany({data:orderDetails})
        return res.json({ orderDetails: result.orderDetails, totalprice })

    } catch (error) {
        res.status(500).json({ msg: "Internal server error", success: false });
    }
})


orderRoute.get("/order-details/:id", authMid, userAuthMid, async (req, res) => {
    try {
        const { id } = req.params;

        const orderDetails = await prisma.orders.findUnique({
            where: { order_id: parseInt(id) },
            include: {
                order_details: {
                    include:{
                        menu:{
                            select:{
                                menu_name:true,
                                price:true
                            }
                        }
                    }
                },
                deliveries: {
                    include: {
                        delivery_agent: true
                    }
                }

            }
        })

        const restaurant = await prisma.restaurant.findUnique({
            where:{
                id_restaurant:orderDetails.id_restaurant
            }
        })

        return res.status(200).json({ success: true, orderDetails , restaurant})

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal server error", success: false });
    }
})



module.exports = orderRoute