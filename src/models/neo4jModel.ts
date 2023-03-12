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
        user_status: '${userDetails.user_status}'
    })`
    );
  } catch (error) {
    console.error("error occur", error);
  } finally {
    neo4jDriver.close();
  }
};
