import express, { type Request, type Response } from "express";
import cors from "cors";
import { pool } from "./db/index.js";
import productRoutes from "./routes/product.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import otpRouter from "./routes/auth.routes.js";
import cartRouter from "./routes/cart.routes.js"
import checkoutRouter from "./routes/checkout.routes.js";
import addressRouter from "./routes/address.routes.js"
import orderRouter from "./routes/order.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import {notFound} from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors(
 { origin: process.env.FRONTEND_URL,
  credentials: true,
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());




app.get("/", (_req: Request, res: Response) => {
  res.send("API is running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1", productRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout",checkoutRouter);
app.use("/api/v1/addresses",addressRouter);
app.use("/api/v1/order",orderRouter);
app.use("/api/v1/payment",paymentRouter);


app.use(notFound)



app.get("/db-test", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT NOW()");

  res.json({
    success: true,
    time: result.rows[0],
  });



});
    app.use(errorHandler)



export default app;