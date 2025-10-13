const express = require('express')
const cors = require('cors');
const http = require('http');
const Server = require('socket.io');
const userRoute = require('./routes/user');
const restRoute = require('./routes/rest');
const orderRoute = require('./routes/order');
const { agentRoute } = require('./routes/deliverAgent');
const app = express();
const server = http.createServer(app);

// app.use(cors())
app.use(express.json())


app.use(cors({
    origin: ['http://localhost:5173', 'https://food-web-app-kappa.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const io = Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://food-web-app-kappa.vercel.app'],
        methods: ["GET", "POST"]
    }
});

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

let drivers = {};
let activeDeliveries = {};
let activeUsers = {};

io.on("connection", (socket) => {
    console.log('User is online : ', socket.id);
    //socket.on("delivery_partner_online", ({ driverId, driverCity }) => {
    //    drivers[driverId] = socket.id;
    //    console.log(`Driver ${driverId} is online in city ${driverCity}`);
    //    // socket.join(`city:${driverCity}`);
    //});
    socket.on('user:join', ({ userId }) => {
        activeUsers[userId] = { socketId: socket.id };
        console.log(`User ${userId} connected with socket ${socket.id}`);

    })

    socket.on('location:update', (data) => {
        console.log(data);
        const lat = data.latitude;
        const long = data.longitude;
        drivers[data.driverId] = { lat, long, socketId: socket.id };
    })

    socket.on("emit_order_to_riders", ({ orderDetails, order, user, restaurant }) => {
        console.log(orderDetails, orderDetails, order, user, restaurant);


        const nearbyRiders = Object.values(drivers).filter(rider => {
            const distance = getDistanceFromLatLonInKm(
                restaurant.lat,
                restaurant.long,
                rider.lat,
                rider.long
            );
            return distance <= 5;
        });

        nearbyRiders.forEach(rider => {
            io.to(rider.socketId).emit("new_order_request", {
                orderDetails,
                order,
                user,
                restaurant,
            });
        });
    })
    socket.on('order_accepted', ({ driverAssignedId, orderId, userId }) => {
        console.log('driver assigned : ', driverAssignedId);
        const userSocketId = activeUsers[userId]?.socketId

        if (userSocketId) {
            activeDeliveries[orderId] = {
                orderId,
                driverAssignedId,
                userSocketId,
                driverSocketId: socket.id
            }
        }

        for (const driverId in drivers) {
            if (driverAssignedId !== Number(driverId)) {
                console.log("drivers ID :", driverId);
                const driverSocketId = drivers[driverId];
                io.to(driverSocketId).emit("order_already_accepted");
            }
        }
    })

    socket.on("disconnect", () => {
        for (const driverId in drivers) {
            if (drivers[driverId].socketId === socket.id) {
                console.log(`Driver ${driverId} went offline`);
                delete drivers[driverId];
                break;
            }
        }
    });

    socket.on("disconnect", () => {
        for (const userId in activeUsers) {
            if (activeUsers[userId].socketId === socket.id) {
                console.log('user went offline')
                delete activeUsers[userId];
                break;
            }
        }
    })
})

app.use('/api/users', userRoute)
app.use('/api/rest', restRoute)
app.use('/api/order', orderRoute)
app.use('/api/agent', agentRoute)

server.listen(3000, () => {
    console.log("http://localhost:3000/")
})