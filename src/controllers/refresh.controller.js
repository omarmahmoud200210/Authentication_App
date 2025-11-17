import { UserSchema } from "../models/user.js";
import jwt from "jsonwebtoken";

const handleRefresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(401).render("errors/401");
    }

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
        if (err) return res.status(403).render("errors/403");
        const foundUser = await UserSchema.findById(decode.userId.id);
        if (!foundUser) return res.status(401).render("errors/401");

        const accessToken = jwt.sign({
            userId: {id: foundUser._id},
        }, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.cookie("access_token", accessToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        });
    });
};

export { handleRefresh };