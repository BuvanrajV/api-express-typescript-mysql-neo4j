import jwt from "jsonwebtoken";
import { checkEmail } from "./../models/mysqlModels/users";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { createLocation, getLocationId } from "../models/mysqlModels/locations";
import { getUserId, getCandidateById } from "../models/mysqlModels/users";
import {
  createDepartment,
  getDepartmentId,
} from "../models/mysqlModels/departments";
import {
  createDepartmentNode,
  createLocationNode,
} from "../models/usersInNeo4j";
import { secretKey } from "../config/config";

export const tokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check CandidateId exist or not
  const candidate: any = await getCandidateById(req.body.candidateId);
  if (candidate[0]) {
    return res.status(400).json({ error: "Candidate Id already exist" });
  }
  // Check Email exist or not
  const userId: any = await getUserId(req.body.email);

  if (userId[0]) {
    return res.status(400).json({ error: "Email already exist" });
  }
  next();
};

export const postMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.candidateId = parseInt(req.body.candidateId);
  // Check any error occurred in initial data validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  // Verifying Token
  const token: any = req.headers["authorization"]?.split(" ")[1];
  jwt.verify(token, secretKey, (err: any) => {
    if (err) {
      res.status(400).send({ message: "Invalid Token" });
    }
  });

  // Check CandidateId exist or not
  const candidate: any = await getCandidateById(req.body.candidateId);
  if (candidate[0]) {
    return res.status(400).json({ error: "Candidate Id already exist" });
  }
  // Check Email exist or not
  const userId: any = await getUserId(req.body.email);

  if (userId[0]) {
    return res.status(400).json({ error: "Email already exist" });
  }
  // Check Location exist or not
  const locationId: any = await getLocationId(req.body.location);
  // Create location in db
  if (!locationId[0]) {
    await createLocation(req.body.location);
    const getLocationIdFromDb: any = await getLocationId(req.body.location);
    const locationId = getLocationIdFromDb[0].location_id;
    await createLocationNode(locationId, req.body.location);
  }
  // Check Department exist or not
  const departmentId: any = await getDepartmentId(req.body.department);
  // Create department in db
  if (!departmentId[0]) {
    await createDepartment(req.body.department);
    const getDepartmentIdFromDb: any = await getDepartmentId(
      req.body.department
    );
    const departmentId = getDepartmentIdFromDb[0].id;
    await createDepartmentNode(departmentId, req.body.department);
  }
  // User details created
  req.body.userDetailsForMysql = {
    user_candidate_id: req.body.candidateId,
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

export const putMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check any error occurred in initial data validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  // Verifying Token
  const token: any = req.headers["authorization"]?.split(" ")[1];
  jwt.verify(token, secretKey, (err: any) => {
    if (err) {
      res.status(400).send({ message: "Invalid Token" });
    }
  });

  req.body.candidateId = parseInt(req.body.candidateId);
  const userId: any = await getCandidateById(req.body.candidateId);
  if (!userId[0]) {
    return res.status(400).json({ error: "Enter valid candidate Id" });
  }
  req.body.userId = userId;
  const emailExist: any = await checkEmail(req.body.email, userId);
  if (emailExist[0]) {
    return res.status(400).json({ error: "Email already Exist" });
  }
  // Check Location exist or not
  const locationId: any = await getLocationId(req.body.location);
  if (!locationId[0]) {
    await createLocation(req.body.location);
    const getLocationIdFromDb: any = await getLocationId(req.body.location);
    const locationId = getLocationIdFromDb[0].location_id;
    await createLocationNode(locationId, req.body.location);
  }
  // Check Department exist or not
  const departmentId: any = await getDepartmentId(req.body.department);
  if (!departmentId[0]) {
    await createDepartment(req.body.department);
    const getDepartmentIdFromDb: any = await getDepartmentId(
      req.body.department
    );
    const departmentId = getDepartmentIdFromDb[0].id;
    await createDepartmentNode(departmentId, req.body.department);
  }
  req.body.userDetails = {
    user_first_name: req.body.firstName,
    user_last_name: req.body.lastName,
    user_email: req.body.email,
    user_startdate: req.body.startDate,
    user_designation: req.body.designation,
    user_updated_date: new Date(),
  };
  next();
};

export const deleteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.candidateId = parseInt(req.body.candidateId);
  const userId: any = await getCandidateById(req.body.candidateId);
  if (!userId[0]) {
    return res.status(400).json({ error: "Enter valid candidate Id" });
  }
  req.body.userId = userId;
  next();
};
