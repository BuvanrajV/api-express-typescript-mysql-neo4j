import { Request, Response } from "express";
import { insertDetailsInUserdepartmentMapping } from "./../models/mysqlModels/userDepartmentMapping";
import { createUser, getUserId } from "../models/mysqlModels/usersModel";
import { getLocationId } from "../models/mysqlModels/locationsModel";
import {
  createUserNode,
  userDepartmentRelationship,
  userLocationRelationship,
} from "../models/neo4jModel";
import { insertDetailsInUserlocationMapping } from "../models/mysqlModels/userLocationMappingModel";
import { getDepartmentId } from "../models/mysqlModels/departmentsModel";

export const postController = async (req: Request, res: Response) => {
  try {
    const userDetailsForMysql = {
      user_first_name: req.body.firstName,
      user_last_name: req.body.lastName,
      user_email: req.body.email,
      user_startdate: req.body.startDate,
      user_designation: req.body.designation,
      user_created_date: new Date(),
      user_status: "1",
    };
    await createUser(userDetailsForMysql);
    let getUserIdFromDb: any = await getUserId(userDetailsForMysql.user_email);
    const userId = getUserIdFromDb[0].user_id;
    const userDetailsForNeo4j = {
      user_id: userId,
      ...userDetailsForMysql,
    };
    await createUserNode(userDetailsForNeo4j);
    const getLocationIdFromDb: any = await getLocationId(req.body.location);
    const locationId = getLocationIdFromDb[0].location_id;
    const userDetailsForUserLocationMapping = {
      map_user_id: userId,
      map_location_id: locationId,
      map_created_date: new Date(),
      map_status: "1",
    };
    await insertDetailsInUserlocationMapping(userDetailsForUserLocationMapping);
    await userLocationRelationship(userId, locationId);
    const getDepartmentIdFromDb: any = await getDepartmentId(
      req.body.department
    );
    const departmentId = getDepartmentIdFromDb[0].id;
    const userDetailsForUserDepartmentMapping = {
      map_user_id: userId,
      map_department_id: departmentId,
      map_created_date: new Date(),
      map_status: "1",
    };
    await insertDetailsInUserdepartmentMapping(
      userDetailsForUserDepartmentMapping
    );
    await userDepartmentRelationship(userId, departmentId);
  } catch {
    console.log("error occur");
  }
};

export const putController = async (req: Request, res: Response) => {};

export const deleteController = async (req: Request, res: Response) => {};
