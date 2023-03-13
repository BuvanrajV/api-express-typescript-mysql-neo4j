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
    // Get userDetailsForMySql in middleware
    const userDetailsForMysql = req.body.userDetailsForMysql;
    // Create user in mysql database
    await createUser(userDetailsForMysql);
    //Get user id from mysql database
    const getUserIdFromDb: any = await getUserId(
      userDetailsForMysql.user_email
    );
    const userId = getUserIdFromDb[0].user_id;
    //create user nodes in neo4j db
    const userDetailsForNeo4j = {
      user_id: userId,
      ...userDetailsForMysql,
    };
    await createUserNode(userDetailsForNeo4j);
    //Get location id from db
    const getLocationIdFromDb: any = await getLocationId(req.body.location);
    const locationId = getLocationIdFromDb[0].location_id;
    //Insert details in userLocationMapping table(mysql db)
    const userDetailsForUserLocationMapping = {
      map_user_id: userId,
      map_location_id: locationId,
      map_created_date: new Date(),
      map_status: "1",
    };
    await insertDetailsInUserlocationMapping(userDetailsForUserLocationMapping);
    // Create a relationship between user node and location node in neo4j
    await userLocationRelationship(userId, locationId);
    // Get department id from db
    const getDepartmentIdFromDb: any = await getDepartmentId(
      req.body.department
    );
    const departmentId = getDepartmentIdFromDb[0].id;
    //Insert details in userDepartmentMapping table(mysql db)
    const userDetailsForUserDepartmentMapping = {
      map_user_id: userId,
      map_department_id: departmentId,
      map_created_date: new Date(),
      map_status: "1",
    };
    await insertDetailsInUserdepartmentMapping(
      userDetailsForUserDepartmentMapping
    );
    // Create relationship between user node and department node
    await userDepartmentRelationship(userId, departmentId);
    // Send the response
    console.log("successfully created");
    res.status(200).json({
      message: "Successfully user created",
    });
  } catch (error: any) {
    console.log("error occur :", error);
    res.status(500).send({
      message: error.message || "Some error occurred.",
    });
  }
};

export const putController = async (req: Request, res: Response) => {};

export const deleteController = async (req: Request, res: Response) => {};
