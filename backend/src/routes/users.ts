import express, { Request, Response } from "express";
import User from "../model/user.model";
import jwt from "jsonwebtoken";
import {check, validationResult} from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async(req : Request, res : Response) => {
    const userId = req.userId

    try{
        const user = await User.findById(userId).select("-password")

        if(!user)
            res.status(400).json({message : "User not found"})
        res.json(user)
    }
    catch(error) {
        res.status(500).json({message : "User $$ not found"})
    }
} )


router.post("/register",
    [
        check("firstName", "First name is required").isString(),
        check("lastName", "Last name is required").isString(),
        check("email", "Email is required").isEmail(),
        check("password", "Password of length 6 or more is required").isLength({
            min : 6
        }),
    ],
    async(req : Request, res : Response) => {
        const error = validationResult(req)
        if(!error.isEmpty()) {
            return res.status(400).json({
                message : error.array()
            })
        }
        try {
            let user = await User.findOne({
            email : req.body.email
        })
        
        if(user)
            return res.status(400).json({"message" : "User already exists."})

        user = new User(req.body)
        await user.save();

        const token = jwt.sign({userId : user.id},
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn : "1d"
        })

        res.cookie("auth_token", token, {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            maxAge : 86400000
        })

        return res.status(200).json({"message": "User Registered"})
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
        "message" : "Something went wrong."})
    }
})

export default router