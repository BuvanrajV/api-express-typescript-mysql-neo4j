import mysqlDb from '../../databases/mysql'

interface UserDetails {
  map_user_id: number;
  map_department_id: number;
  map_created_date: Date;
  map_status: string;
}


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

export const insertInUserdepartmentMapping = (
  userDetails: UserDetails
) => {
  const query='INSERT INTO user_department_mapping SET ? '
  return runQuery(query,userDetails)
}


export const getDepartmentIdFromMapping = (userId: number) => {
  const query='SELECT map_department_id FROM user_department_mapping WHERE map_user_id=? AND map_status="1"'
  return runQuery(query,userId)
}

export const changeMapStatusInDepartment = (userId:number)=>{
  const query = 'UPDATE user_department_mapping SET map_status="0" WHERE map_user_id=?'
  return runQuery(query,userId)
}