import { Router ,Request,Response} from "express";
import { webhook } from "../controllers/payment.controller";

const router = Router();


router.post("/webhook", webhook);

router.get("/testing", (_req: Request, res: Response) => {
  res.send("API is running...");
});




export default router;
