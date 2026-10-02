import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized! Token not found."
            });
        }

        const decoded = jwt.verify(token, "jwtsecret");
        if (!decoded) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Middleware Internal Error!"
        });
    }
};