import { UserSchema } from "../models/user.js";
import jwt from "jsonwebtoken";

const handleRefresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(401).render("errors/401");
    }

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decode) => {
        if (err) return res.status(403).render("errors/403");
        const foundUser = await UserSchema.findById(decode.userId.id);
        if (!foundUser) return res.status(401).render("errors/401");

        const accessToken = jwt.sign({
            userId: {id: foundUser._id},
        }, process.env.JWT_SECRET, { expiresIn: "15m" });

        const cookieBaseOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
        };

        res.cookie("access_token", accessToken,
        {
            ...cookieBaseOptions,
            maxAge: 15 * 60 * 1000
        });

        res.json({ success: true });
    });
};

export { handleRefresh };