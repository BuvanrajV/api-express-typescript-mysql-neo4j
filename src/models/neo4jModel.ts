import neo4jDriver from "../databases/neo4jDatabase";

interface UserDetails {
  user_id: number;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_startdate: string;
  user_designation: string;
  user_created_date: Date;
  user_status: string;
  user_candidate_id : number;
}

export const createUserNode = async (userDetails: UserDetails) => {
  try {
    const session = neo4jDriver.session();
    await session.run(
      `CREATE (:User {
        user_id: ${userDetails.user_id},
        user_first_name : '${userDetails.user_first_name}',
        user_last_name : '${userDetails.user_last_name}',
        user_email: '${userDetails.user_email}',
        user_startdate: '${userDetails.user_startdate}',
        user_designation: '${userDetails.user_designation}',
        user_created_date: '${userDetails.user_created_date}',
        user_status: '${userDetails.user_status}',
        user_candidate_id : ${userDetails.user_candidate_id}
    })`
    );
  } catch (error) {
    console.error("error occur", error);
  }
};

export const userLocationRelationship = async (
  userId: number,
  locationId: number
) => {
  try {
    const session = neo4jDriver.session();
    await session.run(
      `MATCH (user:User {user_id:${userId}}),(location:Location {location_id :${locationId}})
      CREATE (user)-[:LOCATION_OF]->(location)`
    );
  } catch (error) {
    console.error("error occur", error);
  }
};

export const userDepartmentRelationship = async (
  userId: number,
  departmentId: number
) => {
  try {
    const session = neo4jDriver.session();
    await session.run(
      `MATCH (user:User {user_id:${userId}}),(department:Department {department_id :${departmentId}})
      CREATE (user)-[:DEPARTMENT_OF]->(department)`
    );
  } catch (error) {
    console.error("error occur", error);
  } finally {
    neo4jDriver.close();
  }
};

export const changeUserStatusInNeo4j = async (candidateId:number)=>{
  try {
    const session = neo4jDriver.session();
    await session.run(
      `MATCH (user:User {user_candidate_id:${candidateId}})
      SET user.user_status='0'`
    );
  } catch (error) {
    console.error("error occur", error);
  } finally {
    neo4jDriver.close();
  }
}
