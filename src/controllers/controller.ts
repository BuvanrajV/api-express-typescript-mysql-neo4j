import { Request, Response } from "express";
import { createUser, getUserId } from "../models/mysqlModel";
import { createUserNode } from "../models/neo4jModel";

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
    const getId: any = await getUserId(userDetailsForMysql.user_email);
    const id: any = getId[0].user_id;
    const userDetailsForNeo4j = {
      user_id: id,
      ...userDetailsForMysql,
    };
    await createUserNode(userDetailsForNeo4j);
    console.log("successfully created");
  } catch {
    console.log("error occur");
  }
};

export const putController = async (req: Request, res: Response) => {};

export const deleteController = async (req: Request, res: Response) => {};
