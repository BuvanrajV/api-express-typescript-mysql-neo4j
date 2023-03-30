import { runQuery } from '../../databases/mysql'

interface UserDetails {
  map_user_id: number;
  map_department_id: number;
  map_created_date: Date;
  map_status: string;
}

export const insertInUserdepartmentMapping = (userDetails: UserDetails) => {
  const { map_user_id, map_department_id, map_created_date, map_status } =
    userDetails
  const query =
    `INSERT INTO user_department_mapping (map_user_id,map_department_id,map_created_date,map_status)
     VALUES (?,?,?,?)`
  return runQuery(query, [
    map_user_id,
    map_department_id,
    map_created_date,
    map_status,
  ])
}

export const getDepartmentIdFromMapping = (userId: number) => {
  const query =
    'SELECT map_department_id FROM user_department_mapping WHERE map_user_id=? AND map_status="1"'
  return runQuery(query, userId)
}

export const changeMapStatusInDepartment = (userId: number) => {
  const query =
    'UPDATE user_department_mapping SET map_status="0" WHERE map_user_id=?'
  return runQuery(query, userId)
}
