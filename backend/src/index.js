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
    origin: ['http://localhost:5173','https://food-web-app-kappa.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const io = Server(server, {
    cors: {
        origin: ['http://localhost:5173','https://food-web-app-kappa.vercel.app'],
        methods: ["GET", "POST"]
    }
});
let drivers = {};
io.on("connection", (socket) => {
    console.log('User is online : ', socket.id);
    socket.on("delivery_partner_online", ({ driverId, driverCity }) => {
        drivers[driverId] = socket.id;
        console.log(`Driver ${driverId} is online in city ${driverCity}`);
        // socket.join(`city:${driverCity}`);
    });
    socket.on("emit_order_to_riders", ({ orderDetails, order, user, restaurant }) => {
        console.log(orderDetails);

        for (const driverId in drivers) {
            const driverSocketId = drivers[driverId];
            io.to(driverSocketId).emit("new_order_request", {
                orderDetails,
                order,
                user,
                restaurant,
            });
        }


    })
    socket.on('order_accepted', ({ driverAssignedId }) => {
        console.log('driver assigned : ', driverAssignedId);

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
            if (drivers[driverId] === socket.id) {
                console.log(`Driver ${driverId} went offline`);
                delete drivers[driverId];
                break;
            }
        }
    });
})

app.use('/api/users', userRoute)
app.use('/api/rest', restRoute)
app.use('/api/order', orderRoute)
app.use('/api/agent', agentRoute)

server.listen(3000, () => {
    console.log("http://localhost:3000/")
})