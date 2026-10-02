import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({ id }, "jwtsecret", { expiresIn: "30d" });
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: "false",
                message: "All fields reqd!"
            });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            return res.status(400).json({
                success: "false",
                message: "User already exists!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const token = generateToken(newUser.id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: "true",
            message: "User created successfully!",
            newUser
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: "false",
            message: "Internal Server Error!"
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: "false",
                message: "All fields reqd!"
            });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({
                success: "false",
                message: "Invalid Credentials!"
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({
                success: "false",
                message: "Invalid Credentials!"
            });
        }

        const token = generateToken(user.id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: "true",
            message: "User loggedin successfully!",
            user,
            token: token
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: "false",
            message: "Internal Server Error!"
        });
    }
}

export const profile = async (req, res) => {
    try {
        const user = req?.user;
        return res.status(200).json({
            success: "true",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: "false",
            message: "Internal Server Error!"
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        return res.status(200).json({
            success: "true",
            message: "User logged out successfully!"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: "false",
            message: "Internal Server Error!"
        });
    }
}

