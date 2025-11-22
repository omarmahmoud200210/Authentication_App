const logout = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);
    
    const cookieBaseOptions = {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        secure: process.env.NODE_ENV === "production"
    };

    res.clearCookie("jwt", cookieBaseOptions);
    res.clearCookie("access_token", cookieBaseOptions);
    res.redirect("/auth/login");
 }

export { logout }