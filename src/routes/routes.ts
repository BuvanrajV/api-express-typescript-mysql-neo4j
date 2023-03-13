import { Router } from "express";
import { body } from "express-validator";
import {
  postController,
  putController,
  deleteController,
} from "../controllers/controller";
import { postMiddleware } from "../middlewares/middleware";

const router = Router();

router.post(
  // Endpoint
  "/post",
  // Initial data validation using express validator
  body("firstName").isString().isLength({ max: 150 }).isAlphanumeric(),
  body("lastName").isLength({ max: 150 }).isAlphanumeric(),
  body("email").isEmail().withMessage("email should be in email format"),
  body("startDate")
    .isDate()
    .withMessage("Date should be in YYYY-MM-DD this format")
    .custom((startDate) => {
      // Check the startDate is greater than or equal to current date
      let currentDateAndTime = new Date();
      let currentDate = currentDateAndTime.toISOString().slice(0, 10);
      if (startDate < currentDate) {
        throw new Error(
          "startDate should be greater than or equal to current date"
        );
      } else {
        return "no Error";
      }
    }),
  body("location").isLength({ max: 100 }),
  body("department").isLength({ max: 100 }),
  body("designation").isLength({ max: 100 }),
  // Middleware
  postMiddleware,
  // Controller
  postController
);

router.put("/:id", putController);
router.delete("/:id", deleteController);

export default router;
