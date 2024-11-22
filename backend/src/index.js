import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import pathModule from "path";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Đọc tệp swagger.json từ thư mục src
const swaggerFilePath = pathModule.join(__dirname, 'src', 'swagger.json'); 
let swaggerDocument;

try {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8')); 
} catch (error) {
  console.error("Lỗi khi đọc tệp swagger.json:", error);
}

if (swaggerDocument) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 
} else {
  console.log("Không thể tải swagger.json.");
}

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

server.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
