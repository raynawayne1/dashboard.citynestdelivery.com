import { z } from 'zod'

export const RegisterUserSchema = z.object({
    username: z.string().min(3, "Username must not be lesser than 3 characters")
        .max(25, "Username must not be greater than 25 characters")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "The username must contain only letters, numbers and underscore (_)",
        ),
    email: z.string().email("Invalid email. Email must be a valid email address"),
    password: z
        .string()
        .min(3, "Password must not be lesser than 3 characters")
        .max(16, "Password must not be greater than 16 characters"),
    fullName: z.string().min(3, "Name must not be lesser than 3 characters"),
});


export const LoginUserSchema = z.object({
    email: z.string().email("Invalid email. Email must be a valid email address"),
   password: z
        .string()
        .min(3, "Password must not be lesser than 3 characters")
        .max(20, "Password must not be greater than 16 characters"),
});





export const CategorySchema = z.object({
    categoryName: z.string().min(3, "Name must not be lesser than 3 characters"),
});



export const EditCategorySchema = z.object({
    categoryName: z.string().min(3, "Category name must not be lesser than 3 characters"),
    serviceName: z.string().min(3, "Service name must not be lesser than 3 characters"),
});




export const CreateOrderSchema = () => {
  return z.object({
    quantity: z.coerce.number().optional(),
    link:  z.string().optional(),
    username:   z.string().optional(),
  });
};