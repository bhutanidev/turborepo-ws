// pnpm add prisma 
// npx prisma init 
// define schema in schema.prisma
//npx prisma generate - generates a client which can be used

import { PrismaClient } from "@prisma/client";

export const prismaClient  = new PrismaClient()