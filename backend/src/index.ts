import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import accountRoutes from "./routes/account.routes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = "/api/v1";

const apiRouter = express.Router();
app.use(`${BASE_URL}`, apiRouter);

apiRouter.use("/auth", authRoutes);
apiRouter.use("/user", userRoutes);
apiRouter.use("/account", accountRoutes);

// Example protected
// apiRouter.get("/protected", authMiddleware, (req: AuthRequest, res) => {
//   res.json({ message: `Hello user ${req.userId}` });
// });

const PORT = process.env.PORT ?? 5000;
const startServer = async () => {
  await connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
  });
};

startServer();
