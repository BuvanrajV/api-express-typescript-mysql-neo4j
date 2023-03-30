import { runQuery } from '../../databases/mysql'

interface UserDetails {
  map_user_id: number;
  map_location_id: number;
  map_created_date: Date;
  map_status: string;
}

export const insertInUserlocationMapping = (userDetails: UserDetails) => {
  const { map_user_id, map_location_id, map_created_date, map_status } =
    userDetails
  const query =
    `INSERT INTO user_location_mapping (map_user_id,map_location_id,map_created_date,map_status) 
    VALUES (?,?,?,?)`
  return runQuery(query, [
    map_user_id,
    map_location_id,
    map_created_date,
    map_status,
  ])
}

export const getLocationIdFromMapping = (userId: number) => {
  const query =
    'SELECT map_location_id FROM user_location_mapping WHERE map_user_id=? AND map_status="1"'
  return runQuery(query, userId)
}

export const changeMapStatusInLocation = (userId: number) => {
  const query =
    'UPDATE user_location_mapping SET map_status="0" WHERE map_user_id=?'
  return runQuery(query, userId)
}
