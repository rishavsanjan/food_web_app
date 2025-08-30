const express=require('express')
const cors=require('cors');
const prisma = require('./config/db');
const userRoute = require('./routes.js/user');
const restRoute = require('./routes.js/rest');
const app=express();
app.use(cors())
app.use(express.json())
// app.get('/',async(req,res)=>{
//     const u=await prisma.users.findMany();
//     res.json(u)
// })

app.use('/api/users',userRoute)
app.use('/api/rest',restRoute)

app.listen(3000,()=>{console.log("http:/localhost:3000/")
})