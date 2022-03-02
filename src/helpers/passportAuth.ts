const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { Request, Response } from "express";
import { comparePassword } from "./auth";

//  interface IMongoDBUser {
//   googleId?: string;
//   twitterId?: string;
//   githubId?: string;
//   username: string;
//   __v: number;
//   _id: string;
// }

module.exports = (passport: any) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done: any) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "User does not exist" });
          }
          const isMatch = await comparePassword(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
          }
        } catch (error) {
          console.log(error);
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    "googlev1",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/login/v1/google/callback",
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
          const user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          }
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: profile.id,
            verified: true,
          });
          newUser.password = undefined;

          return done(null, newUser);
        } catch (error) {
          console.log(error);
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    "googlev2",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/login/v2/google/callback",
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
          const user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          }
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: profile.id,
            role: "admin",
            verified: true,
          });
          newUser.password = undefined;
          return done(null, newUser);
        } catch (error) {
          console.log(error);
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    "facebookv1",
    new FacebookStrategy(
      {
        clientID: "1207813966289298",
        clientSecret: "af3aaf08f0b0a692e06e82c6cd03981a",
        callbackURL: "http://localhost:5000/api/login/v1/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        console.log("my profile", profile);
        try {
          const user = await User.findOne({ facebookId: profile.id });
          if (user) {
            return done(null, user);
          }
          const newUser = await User.create({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: profile.id,
            verified: true,
          });
          newUser.password = undefined;

          return done(null, newUser);
        } catch (error) {
          console.log(error);
          return done(error, false);
        }
      }
    )
  );
  passport.use(
    "facebookv2",
    new FacebookStrategy(
      {
        clientID: "1207813966289298",
        clientSecret: "af3aaf08f0b0a692e06e82c6cd03981a",
        callbackURL: "http://localhost:5000/api/login/v2/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        console.log("my profile", profile);
        console.log(accessToken);
        // console.log(refreshToken);
        try {
          const user = await User.findOne({ facebookId: profile.id });
          if (user) {
            return done(null, user);
          }
          const newUser = await User.create({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: profile.id,
            role: "admin",
            verified: true,
          });
          newUser.password = undefined;

          return done(null, newUser, { message: "New user created" });
        } catch (error) {
          console.log(error);
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user: any, done: any) => {
    return done(null, user._id);
  });

  passport.deserializeUser(function (id: any, done: any) {
    User.findById(id, function (err: any, user: any) {
      done(err, user);
    });
  });
};

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
//           // res.status(401).send({ message: "User does not exist" });
//           return done(null, false, { message: "User does not exist" });
//         }
//         const isMatch = await comparePassword(password, user.password);
//         if (!isMatch) {
//           //  res.status(401).send({ message: "Incorrect password" });
//           return done(null, false, { message: "Incorrect password" });
//         }
//         // return done(null, user,{message:"success"});
//       } catch (error) {
//         console.log(error);
//         return done(error, false);
//       }
//     }
//   )
// );

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/api/login/v1/google/callback",
//     },
//     async (accessToken: any, refreshToken: any, profile: any, done: any) => {
//       try {
//         const user = await User.findOne({ googleId: profile.id });
//         if (user) {
//           return done(null, user);
//         }
//         const newUser = await User.create({
//           googleId: profile.id,
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           password: profile.id,
//           verified: true,
//         });
//         newUser.password = undefined;

//         return done(null, newUser);
//       } catch (error) {
//         console.log(error);
//         return done(error, false);
//       }
//     }
//   )
// );

// passportv2.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/api/login/v2/google/callback",
//     },
//     async (accessToken: any, refreshToken: any, profile: any, done: any) => {
//       try {
//         const user = await User.findOne({ googleId: profile.id });
//         if (user) {
//           return done(null, user);
//         }
//         const newUser = await User.create({
//           googleId: profile.id,
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           password: profile.id,
//           role: "admin",
//           verified: true,
//         });
//         newUser.password = undefined;
//         return done(null, newUser);
//       } catch (error) {
//         console.log(error);
//         return done(error, false);
//       }
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: "1207813966289298",
//       clientSecret: "af3aaf08f0b0a692e06e82c6cd03981a",
//       callbackURL: "http://localhost:5000/api/login/v1/facebook/callback",
//       profileFields: ["id", "displayName", "photos", "email"],
//     },
//     async (accessToken: any, refreshToken: any, profile: any, done: any) => {
//       console.log("my profile", profile);
//       try {
//         const user = await User.findOne({ facebookId: profile.id });
//         if (user) {
//           return done(null, user);
//         }
//         const newUser = await User.create({
//           facebookId: profile.id,
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           password: profile.id,
//           verified: true,
//         });
//         newUser.password = undefined;

//         return done(null, newUser);
//       } catch (error) {
//         console.log(error);
//         return done(error, false);
//       }
//     }
//   )
// );
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: "1207813966289298",
//       clientSecret: "af3aaf08f0b0a692e06e82c6cd03981a",
//       callbackURL: "http://localhost:5000/api/login/v2/facebook/callback",
//       profileFields: ["id", "displayName", "photos", "email"],
//     },
//     async (accessToken: any, refreshToken: any, profile: any, done: any) => {
//       console.log("my profile", profile);
//       console.log(accessToken);
//       // console.log(refreshToken);
//       try {
//         const user = await User.findOne({ facebookId: profile.id });
//         if (user) {
//           return done(null, user);
//         }
//         const newUser = await User.create({
//           facebookId: profile.id,
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           password: profile.id,
//           role: "admin",
//           verified: true,
//         });
//         newUser.password = undefined;

//         return done(null, newUser, { message: "New user created" });
//       } catch (error) {
//         console.log(error);
//         return done(error, false);
//       }
//     }
//   )
// );

// passport.serializeUser((user: any, done: any) => {
//   return done(null, user._id);
// });

// passport.deserializeUser(function (id: any, done: any) {
//   User.findById(id, function (err: any, user: any) {
//     done(err, user);
//   });
// });

// passportv2.serializeUser((user: any, done: any) => {
//   return done(null, user._id);
// });

// passportv2.deserializeUser(function (id: any, done: any) {
//   User.findById(id, function (err: any, user: any) {
//     done(err, user);
//   });
// });
