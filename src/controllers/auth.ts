import User from "../models/user";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { comparePassword, emailVerification, hashPassword } from "../helpers/auth";



const handleErrors: any = (error: any, req: Request, res: Response) => {
    console.log(error.message);
    return res.status(400).json({
      error: error.message,
    });
  };
  


export const register = async (req: Request, res: Response) => {
    console.log(req.body);
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            error: "User already exists",
          });
        }
        if (!name || !email || !password || !role) {
          return res.status(400).json({
            error: "Please enter all fields",
          });
        }
        await emailVerification(name, email, password, role);
        return res.status(201).json({
          message: `Email has been sent for verification to ${email}`,
        });
      } catch (error: any) {
        handleErrors(error);
        return res.status(500).send("Server Error");
      }



}

export const accountActivation = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
        const decoded = jwt.decode(token);
        interface Decoded {
          name: string;
          email: string;
          password: string;
          role: string;
        }
        const { name, email, password, role } = decoded as Decoded;
    
        const hashedPassword = await hashPassword(password);
        const user = new User({
          name,
          email,
          password: hashedPassword,
          verified: true,
          role,
        });
        await user.save();
        return res.status(201).json({
          message: `Account has been activated`,
        });
      } catch (error: any) {
        handleErrors(error);
        return res.status(500).send("Server Error");
      }


}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        //check if our db has user with that email
        const user = await User.findOne({ email });
        if (!user) {
          return res.json({
            error: "User not found",
          });
        }
        //check password
        const match = await comparePassword(password, user.password);
        if (!match) {
          return res.json({
            error: "Wrong password",
          });
        }
        //create signed token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        user.password = undefined;
    
        res.json({
          token,
          user,
        });
      } catch (error: any) {
        handleErrors(error);
        return res.status(500).send("Server Error");
      }
    }

    export const currentUser: any = async (req: Request, res: Response) => {
        try {
          interface IUser {
            _id: string;
          }
          const { _id } = req.user as IUser;
          const user = await User.findById(_id);
          if (!user) {
            return res.status(404).json({
              error: "User not found",
            });
          }
      
          res.json({ ok: true });
        } catch (error) {
          handleErrors(error);
          return res.status(500).send("Server Error");
        }
      };


      // export const loginGoogle  = async (req: Request, res: Response, token:string) => {
      //       console.log(token);
      // }