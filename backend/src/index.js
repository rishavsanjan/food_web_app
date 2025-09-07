const express = require('express')
const cors = require('cors');
const prisma = require('./config/db');
const userRoute = require('./routes/user');
const restRoute = require('./routes/rest');
const orderRoute = require('./routes/order');
const app = express();
app.use(cors())
app.use(express.json())
// app.get('/',async(req,res)=>{
//     const u=await prisma.users.findMany();
//     res.json(u)
// })

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/api/users', userRoute)
app.use('/api/rest', restRoute)
app.use('/api/order', orderRoute)


app.listen(3000, () => {
    console.log("http://localhost:3000/")
})