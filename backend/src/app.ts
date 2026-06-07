import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.send({
    status: "ok",
  });
});

app.use("/auth", authRoutes);

export default app;
