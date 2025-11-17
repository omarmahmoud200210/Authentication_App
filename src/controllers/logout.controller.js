const logout = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);
    
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });

    res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });

    res.redirect("/auth/login");
 }

export { logout }