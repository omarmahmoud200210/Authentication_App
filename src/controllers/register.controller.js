import { UserSchema } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const renderRegister = (req, res) => res.render("register");

const handleRegister = async (req, res) => {
  const { email, password } = req.body;
  const errs = [];

  // 1. if the email and password is empty
  if (!email || !password) {
    // will display an error in the UI.
    errs.push({ msg: "Please fill in the fields to register." });
    return res.render("register", { error: errs });
  }

  // 2. if the user already exist
  const checkUser = await UserSchema.findOne({ email: email });
   if (checkUser) {
      errs.push({ msg: "Email already registered!" });
      return res.redirect("/auth/login");
  }
  
  // 3. hash the entered password and create a new user 
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const newUser = new UserSchema({ email, password: hash });
  await newUser.save();  

  const accessToken = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  const refreshToken = jwt.sign(
    { id: newUser._id },
    process.env.REFRESH_TOKEN,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.redirect("/auth/login");
};

export { renderRegister, handleRegister };
