import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
    _id : string;
    firstName : string;
    lastName : string;
    email : string;
    password : string;
};

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps : true})

userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

const User = mongoose.model<UserType>("User",userSchema);

export default User;