import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { getLocationId } from "./../models/mysqlModels/locationsModel";
import { getUserId,getCandidateById } from "./../models/mysqlModels/usersModel";
import { getDepartmentId } from "../models/mysqlModels/departmentsModel";

export const postMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check any error occurred in initial data validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  // Check Email exist or not
  const userId: any = await getUserId(req.body.email);
  if (userId[0]) {
    return res.status(400).json({ error: "Email already exist" });
  }
  // Check Location exist or not
  const locationId: any = await getLocationId(req.body.location);
  if (!locationId[0]) {
    return res.status(400).json({ errror: "Location not matched" });
  }
  // Check Department exist or not
  const departmentId: any = await getDepartmentId(req.body.department);
  if (!departmentId[0]) {
    return res.status(400).json({ error: "Department not matched" });
  }
  // Check CandidateId exist or not
  const candidate : any = await getCandidateById(req.body.candidateId);
  if(candidate){
    return res.status(400).json({ error: "Candidate Id already exist" });
  }
  req.body.userDetailsForMysql = {
    user_candidate_id : req.body.candidateId,
    user_first_name: req.body.firstName,
    user_last_name: req.body.lastName,
    user_email: req.body.email,
    user_startdate: req.body.startDate,
    user_designation: req.body.designation,
    user_created_date: new Date(),
    user_status: "1",
  };
  next();
};
