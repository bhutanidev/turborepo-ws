import {z} from "zod"

export const CreateUserSchema = z.object({
    username: z.string().min(5, 'Username must be at least 5 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
  });
  