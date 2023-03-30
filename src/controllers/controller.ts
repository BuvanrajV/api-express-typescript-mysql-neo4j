import jwt from "jsonwebtoken";
import {
  changeUserStatusInMysql,
  updateUser,
} from "../models/mysqlModels/users";
import { Request, Response } from "express";
import {
  changeMapStatusInDepartment,
  getDepartmentIdFromMapping,
  insertInUserdepartmentMapping,
} from "./../models/mysqlModels/userDepartmentMapping";
import { createUser, getUserId } from "../models/mysqlModels/users";
import {
  getLocationId,
  getLocationName,
} from "../models/mysqlModels/locations";
import {
  changeUserStatusInNeo4j,
  createUserNode,
  deleteUserDepartmentRelationship,
  deleteUserLocationRelationship,
  updateUserNode,
  userDepartmentRelationship,
  userLocationRelationship,
} from "../models/usersInNeo4j";
import {
  changeMapStatusInLocation,
  getLocationIdFromMapping,
  insertInUserlocationMapping,
} from "../models/mysqlModels/userLocationMapping";
import {
  getDepartmentId,
  getDepartmentName,
} from "../models/mysqlModels/departments";
import { secretKey } from "../config/config";

export const tokenController = async (req: Request, res: Response) => {
  try {
    const token = jwt.sign(
      req.body.candidateId,
      secretKey
      // , {expiresIn: 60}
    );
    res.json(token);
  } catch (error: any) {
    console.log("error occur :", error);
    res.status(500).send({
      message: error.message || "Some error occurred.",
    });
  }
};

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
    const userForUserLocationMapping = {
      map_user_id: userId,
      map_location_id: locationId,
      map_created_date: new Date(),
      map_status: "1",
    };
    await insertInUserlocationMapping(userForUserLocationMapping);
    // Create a relationship between user node and location node in neo4j
    await userLocationRelationship(userId, locationId);
    // Get department id from db
    const getDepartmentIdFromDb: any = await getDepartmentId(
      req.body.department
    );
    const departmentId = getDepartmentIdFromDb[0].id;
    //Insert details in userDepartmentMapping table(mysql db)
    const userForUserDepartmentMapping = {
      map_user_id: userId,
      map_department_id: departmentId,
      map_created_date: new Date(),
      map_status: "1",
    };
    await insertInUserdepartmentMapping(userForUserDepartmentMapping);
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

export const putController = async (req: Request, res: Response) => {
  try {
    // Get userDetailsForMySql in middleware
    const userDetails = req.body.userDetails;
    const candidateId = req.body.candidateId;
    const userId = req.body.userId;
    // Update user in mysql database
    await updateUser(userId, userDetails);
    //Update user in neo4j database
    await updateUserNode(userId, userDetails);
    // Check the location updated or not
    const getIdForLocation: any = await getLocationIdFromMapping(userId);
    const locationId = getIdForLocation[0].map_location_id;
    const getLocation: any = await getLocationName(locationId);
    const location = getLocation[0].location_name;
    if (location !== req.body.location) {
      //Get location id from db
      await changeMapStatusInLocation(userId);
      const getLocationIdFromDb: any = await getLocationId(req.body.location);
      const locationId = getLocationIdFromDb[0].location_id;
      const userForUserLocationMapping = {
        map_user_id: userId,
        map_location_id: locationId,
        map_created_date: new Date(),
        map_status: "1",
      };
      await insertInUserlocationMapping(userForUserLocationMapping);
      await deleteUserLocationRelationship(userId);
      await userLocationRelationship(userId, locationId);
    }
    // Check the department updated or not
    const getIdForDepartment: any = await getDepartmentIdFromMapping(userId);
    const departmentId = getIdForDepartment[0].map_department_id;
    const getDepartment: any = await getDepartmentName(departmentId);
    const department = getDepartment[0].department_name;
    if (department !== req.body.department) {
      await changeMapStatusInDepartment(userId);
      const getDepartmentIdFromDb: any = await getDepartmentId(
        req.body.department
      );
      const departmentId = getDepartmentIdFromDb[0].id;
      const userForUserDepartmentMapping = {
        map_user_id: userId,
        map_department_id: departmentId,
        map_created_date: new Date(),
        map_status: "1",
      };
      await insertInUserdepartmentMapping(userForUserDepartmentMapping);
      await deleteUserDepartmentRelationship(userId);
      await userDepartmentRelationship(userId, departmentId);
    }

    console.log("successfully updated");
    res.status(200).json({
      message: "Successfully user updated",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      message: error.message || "Some error occurred.",
    });
  }
};

export const deleteController = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    await changeUserStatusInMysql(userId);
    await changeUserStatusInNeo4j(userId);
    console.log("successfully deleted");
    res.status(200).json({
      message: "Successfully Deleted",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      message: error.message || "Some error occurred.",
    });
  }
};
