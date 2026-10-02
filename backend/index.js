import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/01_module_b/api/user", userRoutes);
app.use("/01_module_b/api/task", taskRoutes);


app.get("/", (req, res) => {
    res.send("Server running well!");
})

app.listen(3000, () => {
    console.log(`Server running at port 3000!`);
});