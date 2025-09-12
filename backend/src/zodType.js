const z=require('zod')

const userRoles = ['CUSTOMER', 'RESTAURANT_OWNER', 'DELIVERY_AGENT', 'ADMIN']
const paymentMethods = ["Credit_Card","Debit_Card","Netbanking","UPI","Cash_on_Delivery"] 
const paymentStatus=['completed','failed','cod_collected','refunded']
const vehicletype=['bike','car','cycle']

const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format").optional(),
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10-12 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role:z.enum(userRoles).default('CUSTOMER'),
  city:z.string().min(6).transform(val => val.toLowerCase()),
  restaurant_name:z.string().optional(),
  rating:z.number().optional(),
  vehicle:z.enum(vehicletype).optional()
}).refine((data)=>{
  if(data.role==='RESTAURANT_OWNER'){
    return !!data.restaurant_name && !!data.city;
  }
  if(data.role==='DELIVERY_AGENT'){
    return !!data.vehicle
  }
  return true
});

const loginUserSchema=z.object({
    phone_number:z.string().regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10-12 digits"),
    email: z.string().email("Invalid email format").optional(),
    password:z.string(6,"Password must be at least 6 characters")
})

const orderSchema=z.object({
  id_restaurant:z.number().int(),
  items:z.array(z.object({
    menu_id:z.number().int(),
    quantity:z.number().int().positive()
  })).nonempty("Order must contain at least one item"),
  instruction:z.string().optional(),
  payment_method:z.enum(paymentMethods).default("Cash_on_Delivery")
})


const createMenuSchema = z.object({
  menu_name: z.string().min(3),
  description: z.string().optional(),
  availability: z.boolean().optional(),
  category: z.enum(["veg", "non_veg"]), 
  price: z.number().int().min(0),
  calories: z.number().min(0),
  protein: z.number().min(0),
  fat: z.number().min(0),
  carbohydrates: z.number().min(0),
  fiber: z.number().min(0),
  cholesterol: z.number().min(0),
  image:z.string().optional()
});

const updateMenuSchema = z.object({
  menu_id:z.number(),
  menu_name: z.string().min(3).optional(),
  description: z.string().optional(),
  availability: z.boolean().optional(),
  category: z.enum(["veg", "non_veg"]).optional(), 
  price: z.number().int().min(0).optional(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  carbohydrates: z.number().min(0).optional(),
  fiber: z.number().min(0).optional(),
  cholesterol: z.number().min(0).optional(),
  image:z.string().optional()
});


const updateAddress=z.object({
  address:z.string().min(6),
  city:z.string().min(6).transform(val => val.toLowerCase())
})

const updateTransaction=z.object({
  transaction_id:z.string().min(4).optional(),
  payment_status:z.enum(paymentStatus).default('completed')
}).refine((data)=>{
  if(data.payment_status!='cod_collected'){
    return !!data.transaction_id
  }
  return true
})

module.exports={createUserSchema,loginUserSchema,orderSchema,createMenuSchema,updateMenuSchema,updateAddress,updateTransaction}