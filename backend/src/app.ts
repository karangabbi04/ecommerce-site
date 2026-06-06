import express, { type Request, type Response } from "express";
import cors from "cors";
import { pool } from "./db/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import productRoutes from "./routes/product.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import otpRouter from "./routes/auth.routes.js";
import cartRouter from "./routes/cart.routes.js"
import checkoutRouter from "./routes/checkout.routes.js";

const app = express();

app.use(cors(
 { origin: "http://localhost:3000",
  credentials: true,
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());




app.get("/", (_req: Request, res: Response) => {
  res.send("API is running...");
});

app.use("/api/v1", productRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout",checkoutRouter);




app.get("/db-test", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT NOW()");

  res.json({
    success: true,
    time: result.rows[0],
  });



});
    app.use(errorHandler)



export default app;