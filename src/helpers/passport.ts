// // const JwtStrategy = require("passport-jwt").Strategy;
// // const ExtractJwt = require("passport-jwt").ExtractJwt;
// const LocalStrategy = require("passport-local").Strategy;
// // const mongoose = require("mongoose");
// import User from "../models/user";
// import { Request, Response } from "express";
// import passport from "passport";
// import { comparePassword } from "./auth";

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async (email: string, password: string, done: any) => {
//       try {
//         const user = await User.findOne({ email });
//         if (!user) {
//           return done(null, false, { message: "User does not exist" });
//         }
//         const isMatch = await comparePassword(password, user.password);
//         if (!isMatch) {
//           return done(null, false, { message: "Incorrect password" });
//         }
//         return done(null, user);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );





// // passport.use(
// //   new LocalStrategy(function (email: any, password: any, done: any) {
// //     User.findOne({ email }, function (err: any, user: any) {
// //       if (err) {
// //         return done(err);
// //       } //When some error occurs

// //       if (!user) {
// //         //When username is invalid
// //         return done(null, false, { message: "Incorrect username." });
// //       }

// //       if (!comparePassword(password, user.password)) {
// //         return done(null, false, { message: "Incorrect password." });
// //       }

// //       return done(null, user); //When user is valid
// //     });
// //   })
// // );

// //Persists user data inside session
// passport.serializeUser(function (user: any, done: any) {
//   done(null, user.id);
// });

// //Fetches session details using session id
// passport.deserializeUser(function (id:any, done:any) {
//   User.findById(id, function (err:any, user:any) {
//       done(err, user);
//   });
// });



// // passport.use(
// //   new LocalStrategy(
// //     async (
// //       email: string,
// //       password: string,
// //       done: any
// //     ) => {

// //       try {
// //         const user = await User.findOne({ email });
// //         if (!user) {
// //           return done(null, false,{message: "User not found"});
// //         }
// //         const match = await comparePassword(password, user.password);
// //         if (!match) {
// //           return done(null, false,{message: "Wrong password"});
// //         }
// //         user.password = undefined;
// //         return done(null, user, {message: "Logged in successfully"});
// //       } catch (error) {
// //         console.log(error);
// //         return done(error, false);
// //       }
// //     }
// //   )
// // );

// // passport.serializeUser((user: any, done: any) => {
// //   return done(null, user._id);
// // });

// // passport.deserializeUser(function (id: any, done: any) {
// //   User.findById(id, function (err: any, user: any) {
// //     done(err, user);
// //   });
// // });

// // const opts = {};

// // interface IConfig {
// //   jwtFromRequest: any;
// //   secretOrKey: any;
// // }

// // const config: IConfig = {
// //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// //   secretOrKey: process.env.JWT_SECRET,
// // };

// // passport.use(
// //   new JwtStrategy(config, async (jwt_payload: any, done: any) => {
// //     console.log(jwt_payload);
// //     try {
// //         const user = await User.findById(jwt_payload._id);
// //         if (user) {
// //           return done(null, user);
// //         }
// //         return done(null, false);
// //       } catch (error) {
// //         return done(error, false);
// //       }

// //   })
// // );
