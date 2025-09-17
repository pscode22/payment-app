import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middleware/auth";
import { AuthRequest } from "./middleware/auth";
import userRoutes from "./routes/users.routes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

// Example protected
app.get("/protected", authMiddleware, (req: AuthRequest, res) => {
  res.json({ message: `Hello user ${req.userId}` });
});

const PORT = process.env.PORT ?? 5000;
const startServer = async () => {
  await connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
  });
};

startServer();
