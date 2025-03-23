import { NextFunction , Request,Response } from "express"
import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError"


export const attachUser = async(req:Request,res:Response,next: NextFunction)=>{

    try {
        const header = req.headers['authorization']
        const token = header?.split(" ")[1] as string
        if(!token){
            next(new ApiError(403,"Invalid token"))
            return
        }
        const key :string = process.env.JWT_SECRET as string
    
        const decoded = await jwt.verify(token,key)
    
        if(decoded && typeof decoded === 'object'){
            // req.userId = decoded.id
            next()
            return
        }else{
            // res.status(403).json({error:"Not logged in or invalid token"})
            next(new ApiError(403,"Not logged in or invalid token"))
            return
        }
    } catch (error) {
        console.error(error)
        next(new ApiError(403,"Invalid token"))

    }

}