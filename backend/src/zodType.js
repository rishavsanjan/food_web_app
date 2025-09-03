const z=require('zod')

const userRoles = ['CUSTOMER', 'RESTAURANT_OWNER', 'DELIVERY_AGENT', 'ADMIN']

const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format").optional(),
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10-12 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role:z.enum(userRoles).default('CUSTOMER')
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
  })).nonempty("Order must contain at least one item")
})


const createMenuSchema = z.object({
  menu_name: z.string().min(3),
  description: z.string().optional(),
  availability: z.boolean().optional(),
  category: z.enum(["veg", "non-veg"]), 
  price: z.number().int().min(0),
  calories: z.number().min(0),
  protein: z.number().min(0),
  fat: z.number().min(0),
  carbohydrates: z.number().min(0),
  fiber: z.number().min(0),
  cholesterol: z.number().min(0),
  image:z.string().optional()
});

module.exports={createUserSchema,loginUserSchema,orderSchema,createMenuSchema}