import mysqlDb from '../../databases/mysql'

interface UserDetails {
  map_user_id: number;
  map_location_id: number;
  map_created_date: Date;
  map_status: string;
}

export const insertDetailsInUserlocationMapping = (
  userDetails: UserDetails
) => {
  return new Promise((resolve, reject) => {
    mysqlDb.query(
      'INSERT INTO user_location_mapping SET ?',
      [userDetails],
      (err, res) => {
        if (err) {
          console.error(err)
          reject()
        } else {
          resolve(res)
        }
      }
    )
  })
}
