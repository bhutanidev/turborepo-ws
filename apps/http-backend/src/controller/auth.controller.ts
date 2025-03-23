import ApiError from "../utils/ApiError";
import apiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CreateUserSchema } from "@workspace/common/types";
// import {z} from "zod"

export const signupController=asyncHandler((req,res,next)=>{
    const {password, email , name}=req.body
    const data = CreateUserSchema.safeParse(req.body)
    if(!data.success){
        next(new ApiError(400,data.error.message))
        return
    }
    // if(typeof email !== 'string' || email.trim()==='' ||
    //    typeof password !== 'string' || password.trim()==='' ||
    //    typeof name !== 'string' || name.trim()===''
    // ){
    //     next(new ApiError(400,"Fill all required fields and must be valid"))
    //     return
    // }
    res.status(200).json(new apiResponse(200,{email,password,name},"created succsessfully"))
})

export const signinController=asyncHandler((req,res,next)=>{
    const {password, email }=req.body
    if(!password || !email){
        next(new ApiError(400,"Fill all required fields"))
        return
    }
    if(typeof email !== 'string' || email.trim()==='' ||
       typeof password !== 'string' || password.trim()===''
    ){
        next(new ApiError(400,"Fill all required fields and must be valid"))
        return
    }
    //add cookie
    res.status(200).json(new apiResponse(200,{email,password},"created succsessfully"))
})


module.exports={
    signupController
}