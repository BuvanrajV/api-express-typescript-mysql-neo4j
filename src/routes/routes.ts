import { Router } from "express";
import {
  postController,
  putController,
  deleteController,
} from "../controllers/controller";

const router = Router();

router.post("/post", postController);
router.put("/:id", putController);
router.delete("/:id", deleteController);
export default router;
