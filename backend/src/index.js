const express = require('express')
const cors = require('cors');
const userRoute = require('./routes/user');
const restRoute = require('./routes/rest');
const orderRoute = require('./routes/order');
const { agentRoute } = require('./routes/deliverAgent');
const app = express();
app.use(cors())
app.use(express.json())


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/api/users', userRoute)
app.use('/api/rest', restRoute)
app.use('/api/order', orderRoute)
app.use('/api/agent',agentRoute)

app.listen(3000, () => {
    console.log("http://localhost:3000/")
})