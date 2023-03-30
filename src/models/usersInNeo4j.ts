import neo4jDriver from '../databases/neo4j'

interface UserDetails {
  user_id: number;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_startdate: string;
  user_designation: string;
  user_created_date: Date;
  user_status: string;
  user_candidate_id: number;
}

export const createUserNode = async (userDetails: UserDetails) => {
  try {
    const session = neo4jDriver.session()
    await session.run(
      `CREATE (:User {
        user_id: $user_id,
        user_first_name : $user_first_name,
        user_last_name : $user_last_name,
        user_email: $user_email,
        user_startdate: $user_startdate,
        user_designation: $user_designation,
        user_created_date: $user_created_date,
        user_status: $user_status,
        user_candidate_id : $user_candidate_id
    })`,
      {
        user_id: userDetails.user_id,
        user_first_name: `${userDetails.user_first_name}`,
        user_last_name: `${userDetails.user_last_name}`,
        user_email: `${userDetails.user_email}`,
        user_startdate: `${userDetails.user_startdate}`,
        user_designation: `${userDetails.user_designation}`,
        user_created_date: `${userDetails.user_created_date}`,
        user_status: `${userDetails.user_status}`,
        user_candidate_id: userDetails.user_candidate_id,
      }
    )
  } catch (error) {
    console.error('error occur', error)
  }
}

export const userLocationRelationship = async (
  userId: number,
  locationId: number
) => {
  try {
    const session = neo4jDriver.session()
    await session.run(
      `MATCH (user:User {user_id:$userId}),(location:Location {location_id :$locationId})
      CREATE (user)-[:LOCATION_OF]->(location)`,
      { userId, locationId }
    )
  } catch (error) {
    console.error('error occur', error)
  }
}

export const userDepartmentRelationship = async (
  userId: number,
  departmentId: number
) => {
  try {
    const session = neo4jDriver.session()
    await session.run(
      `MATCH (user:User {user_id:$userId}),(department:Department {department_id :$departmentId})
      CREATE (user)-[:DEPARTMENT_OF]->(department)`,
      { userId, departmentId }
    )
  } catch (error) {
    console.error('error occur', error)
  }
}

export const updateUserNode = async (
  candidateId: number,
  userDetails: UserDetails
) => {
  try {
    const session = neo4jDriver.session()
    await session.run(
      ` MATCH (node:User {user_candidate_id : $user_candidate_id})
        SET node.user_first_name =$user_first_name,
        node.user_last_name =$user_last_name,
        node.user_email=$user_email,
        node.user_designation= $user_designation`,
      {
        user_first_name: `${userDetails.user_first_name}`,
        user_last_name: `${userDetails.user_last_name}`,
        user_email: `${userDetails.user_email}`,
        user_designation: `${userDetails.user_designation}`,
        user_candidate_id: candidateId,
      }
    )
  } catch (error) {
    console.error('error occur', error)
  }
}

export const changeUserStatusInNeo4j = async (candidateId: number) => {
  try {
    const session = neo4jDriver.session()
    await session.run(
      `MATCH (user:User {user_candidate_id:${candidateId}})
      SET user.user_status='0'`
    )
  } catch (error) {
    console.error('error occur', error)
  }
}

export const deleteUserLocationRelationship = async (userId: number) => {
  try {
    const session = neo4jDriver.session()
    await session.run(
      `MATCH (n:User {user_id: $user_id})-[r:LOCATION_OF]->(:Location) 
      DELETE r`,
      {
        user_id: userId,
      }
    )
  } catch (error) {
    console.error('error occur : ', error)
  }
}

export const deleteUserDepartmentRelationship = async (userId: number) => {
  try {
    const session = neo4jDriver.session()
    await session.run(
      `MATCH (n:User {user_id: $user_id})-[r:DEPARTMENT_OF]->(:Department)
        DELETE r`,
      {
        user_id: userId,
      }
    )
  } catch (error) {
    console.error('error occur : ', error)
  }
}

