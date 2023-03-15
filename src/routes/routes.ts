import { Router } from 'express'
import { body } from 'express-validator'
import {
  postController,
  putController,
  deleteController,
} from '../controllers/controller'
import {
  postMiddleware,
  putMiddleware,
  deleteMiddleware,
} from '../middlewares/middlewares'

const router = Router()

router.post(
  // Endpoint
  '/post',
  // Initial data validation using express validator
  [
    body('candidateId')
      .isNumeric()
      .exists()
      .isLength({ max: 10 })
      .notEmpty()
      .withMessage('CandidateId Should not be empty'),
    body('firstName')
      .isString()
      .exists()
      .isLength({ max: 150 })
      .isAlphanumeric()
      .withMessage('Firstname should be in alphanumeric'),
    body('lastName')
      .isString()
      .isLength({ max: 150 })
      .isAlphanumeric()
      .withMessage('Lastname Should be in alphanumeric'),
    body('email')
      .isString()
      .exists()
      .isEmail()
      .withMessage('email should be in email format'),
    body('startDate')
      .isString()
      .exists()
      .isDate()
      .withMessage('Date should be in YYYY-MM-DD this format')
      .custom((startDate) => {
        // Check the startDate is greater than or equal to current date
        let currentDateAndTime = new Date()
        let currentDate = currentDateAndTime.toISOString().slice(0, 10)
        if (startDate < currentDate) {
          throw new Error(
            'startDate should be greater than or equal to current date'
          )
        } else {
          return 'no Error'
        }
      }),
    body('location')
      .isLength({ max: 100 })
      .exists()
      .withMessage('location field is missing')
      .notEmpty()
      .withMessage('Location should not be empty'),
    body('department')
      .isLength({ max: 100 })
      .exists()
      .withMessage('department field is missing')
      .notEmpty()
      .withMessage('Department should not be empty'),
    body('designation').isLength({ max: 100 }),
  ],
  // Middleware
  postMiddleware,
  // Controller
  postController
)

router.put(
  '/put', // Initial data validation using express validator
  [
    body('candidateId')
      .isNumeric()
      .isLength({ max: 10 })
      .notEmpty()
      .withMessage('CandidateId Should not be empty'),
    body('firstName')
      .isString()
      .isLength({ max: 150 })
      .isAlphanumeric()
      .withMessage('Firstname should be in alphanumeric'),
    body('lastName')
      .isString()
      .isLength({ max: 150 })
      .isAlphanumeric()
      .withMessage('Lastname Should be in alphanumeric'),
    body('email')
      .isString()
      .isEmail()
      .withMessage('email should be in email format'),
    body('startDate')
      .isString()
      .isDate()
      .withMessage('Date should be in YYYY-MM-DD this format')
      .custom((startDate) => {
        // Check the startDate is greater than or equal to current date
        let currentDateAndTime = new Date()
        let currentDate = currentDateAndTime.toISOString().slice(0, 10)
        if (startDate < currentDate) {
          throw new Error(
            'startDate should be greater than or equal to current date'
          )
        } else {
          return 'no Error'
        }
      }),
    body('location')
      .isLength({ max: 100 })
      .withMessage('location field is missing')
      .notEmpty()
      .withMessage('Location should not be empty'),
    body('department')
      .isLength({ max: 100 })
      .withMessage('department field is missing')
      .notEmpty()
      .withMessage('Department should not be empty'),
    body('designation').isLength({ max: 100 }),
  ],
  putMiddleware,
  putController
)
router.delete('/delete', deleteMiddleware, deleteController)

export default router
