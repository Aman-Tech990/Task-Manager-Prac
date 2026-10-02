import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { createTask, deleteTask, getAllTasks, updateTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/create", isAuth, createTask);
router.put("/update/:id", isAuth, updateTask);
router.delete("/delete/:id", isAuth, deleteTask);
router.get("/allTasks", isAuth, getAllTasks);

export default router;