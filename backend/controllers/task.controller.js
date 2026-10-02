import { prisma } from "../lib/prisma.js";

export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: "false",
                message: "All fields reqd!"
            });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                userId: req.user.id
            }
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully!",
            task
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: true,
            message: "Internal Server Error!"
        });
    }
}

export const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description } = req.body;

        if (title === undefined && description === undefined) {
            return res.status(400).json({
                success: false,
                message: "Atleast one field reqd!"
            });
        }

        const data = {};

        if (title !== undefined) {
            data.title = title;
        }

        if (description !== undefined) {
            data.description = description;
        }

        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data
        });

        return res.status(200).json({
            success: true,
            message: "Task updated successfully!",
            updatedTask
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: "false",
            message: "Internal Server Error!"
        });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedTask = await prisma.task.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            success: true,
            message: "Task deleted Successfully!",
            deletedTask
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
}

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        return res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
}