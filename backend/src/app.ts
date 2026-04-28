import express, { type Request, type Response } from "express";
import cors from "cors";
import { pool } from "./db/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(cors());
app.use(express.json());



app.use("/api/v1", productRoutes);


app.get("/", (_req: Request, res: Response) => {
  res.send("API is running...");
});

app.get("/db-test", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT NOW()");

  res.json({
    success: true,
    time: result.rows[0],
  });


    app.use(errorHandler)

});

export default app;