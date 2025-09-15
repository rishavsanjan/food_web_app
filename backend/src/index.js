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

app.use(cors())
app.use(express.json())


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const io =  Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log('User is online : ', socket.id);
    socket.on("delivery_partner_online", ({ driverId, driverCity }) => {
        console.log(`Driver ${driverId} is online in city ${driverCity}`);
        socket.join(`city:${driverCity}`);
    });
})

app.use('/api/users', userRoute)
app.use('/api/rest', restRoute)
app.use('/api/order', orderRoute)
app.use('/api/agent', agentRoute)

server.listen(3000, () => {
    console.log("http://localhost:3000/")
})