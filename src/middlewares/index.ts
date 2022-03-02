// import expressJwt from "express-jwt";
import express, { Request, Response, NextFunction } from "express";
// import Post from "../models/post";
// import Post from "../models/post";
import User from "../models/user";


export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send("Unauthorized");
  }
};




export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id } = req.user as any;
        const user = await User.findById(_id);
        if (user.role !== "admin") {
        return res.status(403).json({
            error: "Access denied",
        });
        } else {
        next();
        }
    } catch (error) {
        return res.status(400).send(error);
    }
    }

export const isUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id } = req.user as any;
        const user = await User.findById(_id);
        if (user.role !== "user") {
        return res.status(403).json({
            error: "Access denied",
        });
        } else {
        next();
        }
    } catch (error) {
        return res.status(400).send(error);
    }
    }
