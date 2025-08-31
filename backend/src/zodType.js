const z=require('zod')

const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format").optional(),
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10-12 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  is_admin: z.boolean().optional(),
});

const loginUserSchema=z.object({
    phone_number:z.string().regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10-12 digits"),
    email: z.string().email("Invalid email format").optional(),
    password:z.string(6,"Password must be at least 6 characters")
})

module.exports={createUserSchema,loginUserSchema}