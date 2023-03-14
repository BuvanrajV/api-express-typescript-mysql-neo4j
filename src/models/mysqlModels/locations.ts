import mysqlDb from '../../databases/mysql'

export const getLocationId = (location: string) => {
  return new Promise((resolve, reject) => {
    mysqlDb.query(
      'SELECT location_id from locations where location_name=?',
      [location],
      (err, res) => {
        if (err) {
          console.error('error : ', err)
          reject(err)
        } else {
          resolve(res)
        }
      }
    )
  })
}
