import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";

export const userModel = mongoose.model('User', userSchema);

export default class userRepo {

    async signUp(user){
        try{
            const existingUser = await userModel.findOne({email: user.email });
            if(! existingUser){
                const newUser = new userModel(user);
                await newUser.save();
                return { message: "User created successfully", status: 201};
            }else{
                return { message: "User already exists", status: 400};
            }
        }catch(err){
            console.log("Creating user",err);
            return { message: "Error creating user", status: 500};
        }
    }

    async getUserByEmail(email){
        try{
            return await userModel.findOne({ email });
        }catch(err){
            console.log("Error! Getting user by email", err);
            return { message: "Error! Getting user by email", status: 500};
        }
    }

    async signIn(email){
        try{
            const user = await userModel.findOne({email}).select('+password');
            return user;
        }catch(err){
            console.log("Error on finding user: ", err);
            return null;
        }
    }
}