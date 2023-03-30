import { runQuery } from '../../databases/mysql'


export const createLocation = (location: string) => {
  const query='INSERT INTO locations (location_name,location_status) VALUES (?,"1")'
  return runQuery(query,location)
}

export const getLocationId = (location: string) => {
  const query='SELECT location_id FROM locations WHERE location_name=?'
  return runQuery(query,location)
}

export const getLocationName = (locationId : number)=>{
  const query='SELECT location_name FROM locations WHERE location_id=?'
  return runQuery(query,locationId)
}