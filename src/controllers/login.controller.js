import { UserSchema } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const renderLogin = (req, res) => {
    res.render("login");
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render("login", { error: "Please fill in the fields to login." });
    }

    const user = await UserSchema.findOne({ email });

    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const cookieBaseOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
            };

            const accessToken = jwt.sign({
                userId: {id: user._id},
            }, process.env.JWT_SECRET, { expiresIn: "15m" });
            
            const refreshToken = jwt.sign({
                userId: {id: user._id},
            }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
            
            res.cookie("jwt", refreshToken, {
                ...cookieBaseOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000
            }); 
            
            res.cookie("access_token", accessToken, {
                ...cookieBaseOptions,
                maxAge: 15 * 60 * 1000
            });

            return res.redirect("/dashboard");
        }
        else {
            return res.render("login", { error: "Wrong Password" });
        }
    }

    else {
        return res.render("login", { error: "User not found" });
    }
}

export { renderLogin, handleLogin };