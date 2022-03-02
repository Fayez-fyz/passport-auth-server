import express from "express";
import passport from "passport";

import {
  accountActivation,
  currentUser,
  login,
  register,
} from "../controllers/auth";

import { checkAuth, isAdmin, isUser } from "../middlewares";

const router: express.Router = express.Router();

router.post("/register", register);
router.post("/account-activation", accountActivation);
router.post(
  "/login",
  function (req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          error: info.message,
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          user,
        });
      });
    }
    )(req, res, next);
  },
login
);

router.get(
  "/login/v1/google",
  passport.authenticate("googlev1", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/login/v1/google/callback",
  passport.authenticate("googlev1", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000/user/dashboard",
  })
);
router.get(
  "/login/v2/google",
  passport.authenticate("googlev2", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/login/v2/google/callback",
  passport.authenticate("googlev2", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000/admin/dashboard",
  })
);
router.get(
  "/login/v1/facebook",
  passport.authenticate("facebookv1", { scope: ["email", "public_profile"] })
);
router.get(
  "/login/v1/facebook/callback",
  passport.authenticate("facebookv1", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000/user/dashboard",
  })
);
router.get(
  "/login/v2/facebook",
  passport.authenticate("facebookv2", { scope: ["email", "public_profile"] })
);
router.get(
  "/login/v2/facebook/callback",
  passport.authenticate("facebookv2", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000/admin/dashboard",
  })
);

router.get("/user", (req: any, res: any) => {
  // console.log(req.user);
  res.send(req.user);
});

router.get("/logout", (req: any, res: any) => {
  if (req.user) {
    req.logout();
    res.send("done");
  }
});
router.get("/current-user", [checkAuth, isUser], currentUser);
router.get("/current-admin", [checkAuth, isAdmin], currentUser);


module.exports = router;
