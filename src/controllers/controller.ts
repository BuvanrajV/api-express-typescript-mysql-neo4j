import { changeUserStatusInMysql } from '../models/mysqlModels/users'
import { Request, Response } from 'express'
import { insertInUserdepartmentMapping } from './../models/mysqlModels/userDepartmentMapping'
import { createUser, getUserId } from '../models/mysqlModels/users'
import { getLocationId } from '../models/mysqlModels/locations'
import {
  changeUserStatusInNeo4j,
  createUserNode,
  userDepartmentRelationship,
  userLocationRelationship,
} from '../models/usersInNeo4j'
import { insertInUserlocationMapping } from '../models/mysqlModels/userLocationMapping'
import { getDepartmentId } from '../models/mysqlModels/departments'

export const postController = async (req: Request, res: Response) => {
  try {
    // Get userDetailsForMySql in middleware
    const userDetailsForMysql = req.body.userDetailsForMysql
    // Create user in mysql database
    await createUser(userDetailsForMysql)
    //Get user id from mysql database
    const getUserIdFromDb: any = await getUserId(
      userDetailsForMysql.user_email
    )
    const userId = getUserIdFromDb[0].user_id
    //create user nodes in neo4j db
    const userDetailsForNeo4j = {
      user_id: userId,
      ...userDetailsForMysql,
    }
    await createUserNode(userDetailsForNeo4j)
    //Get location id from db
    const getLocationIdFromDb: any = await getLocationId(req.body.location)
    const locationId = getLocationIdFromDb[0].location_id
    //Insert details in userLocationMapping table(mysql db)
    const userDetailsForUserLocationMapping = {
      map_user_id: userId,
      map_location_id: locationId,
      map_created_date: new Date(),
      map_status: '1',
    }
    await insertInUserlocationMapping(userDetailsForUserLocationMapping)
    // Create a relationship between user node and location node in neo4j
    await userLocationRelationship(userId, locationId)
    // Get department id from db
    const getDepartmentIdFromDb: any = await getDepartmentId(
      req.body.department
    )
    const departmentId = getDepartmentIdFromDb[0].id
    //Insert details in userDepartmentMapping table(mysql db)
    const userForUserDepartmentMapping = {
      map_user_id: userId,
      map_department_id: departmentId,
      map_created_date: new Date(),
      map_status: '1',
    }
    await insertInUserdepartmentMapping(
      userForUserDepartmentMapping
    )
    // Create relationship between user node and department node
    await userDepartmentRelationship(userId, departmentId)
    // Send the response
    console.log('successfully created')
    res.status(200).json({
      message: 'Successfully user created',
    })
  } catch (error: any) {
    console.log('error occur :', error)
    res.status(500).send({
      message: error.message || 'Some error occurred.',
    })
  }
}

export const putController = async (req: Request, res: Response) => {}

export const deleteController = async (req: Request, res: Response) => {
  try {
    const candidateId = parseInt(req.body.candidateId)
    await changeUserStatusInMysql(candidateId)
    await changeUserStatusInNeo4j(candidateId)
    console.log('successfully deleted')
    res.status(200).json({
      message: 'Successfully Deleted',
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).send({
      message: error.message || 'Some error occurred.',
    })
  }
}
