import ApiError from "../utils/ApiError";
import apiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CreateUserSchema , SigninUserSchema} from "@workspace/common/zodschema"
import {prismaClient} from "@workspace/db/client"
import jwt from "jsonwebtoken"
import { comparePassword,hashPassword } from "../utils/Encryption";
import { JWT_SECRET } from "@workspace/backend-common/config";

export const signupController=asyncHandler(async(req,res,next)=>{
    const {password, email , name}=req.body
    const psdata = CreateUserSchema.safeParse(req.body)
    if(!psdata.success){
        next(new ApiError(400,psdata.error.message))
        return
    }
    const found = await prismaClient.user.findFirst({
        where:{
            email:email
        }
    })
    if(found){
        next(new ApiError(400,"Email already exists"))
        return;
    }
    const hashedpw = await hashPassword(password)
    prismaClient.user.create({
        data:{
            email:psdata.data?.email,
            password:hashedpw as string,
            name:psdata.data?.name
        }
    })
    res.status(200).json(new apiResponse(200,{email,name},"User created succsessfully"))
})

export const signinController=asyncHandler(async(req,res,next)=>{
    const {password, email }=req.body
    const data = SigninUserSchema.safeParse(req.body)
    if(!data.success){
        next(new ApiError(400,data.error.message||"Fill the fields correctly"))
        return;
    }
    if(typeof email !== 'string' || email.trim()==='' ||
       typeof password !== 'string' || password.trim()===''
    ){
        next(new ApiError(400,"Fill all required fields and must be valid"))
        return
    }
    //add cookie
    const found = await prismaClient.user.findFirst({
        where:{
            email:email
        }
    })
    if(!found){
        next(new ApiError(400,"Email does not exist"))
        return;
    }
    const match = await comparePassword(password,found.password)
    if(!match){
        next(new ApiError(400,"Incorrect Password"))
        return
    }
    const token = jwt.sign({id:found.id,email:found.email,name:found.name},JWT_SECRET)
    res.cookie("token",token,{httpOnly:true}).status(200).json(new apiResponse(200,{email,password},"created succsessfully"))
})


module.exports={
    signupController,
    signinController
}