import z from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(5, 'Username must be at least 5 characters'),
    email: z.string().email('Invalid email format').trim(),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
});

export const SigninUserSchema = z.object({
    email: z.string().min(1).email('Invalid email format').trim(),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
});