import mysqlDb from '../../databases/mysql'


const runQuery = (query: string, input: any) => {
  return new Promise((resolve, reject) => {
    mysqlDb.query(query, input, (err, res) => {
      if (err) {
        console.error('error : ', err)
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export const getLocationId = (location: string) => {
  const query='SELECT location_id from locations where location_name=?'
  return runQuery(query,location)
}

export const getLocationName = (locationId : number)=>{
  const query='SELECT location_name from locations where location_id=?'
  return runQuery(query,locationId)
}