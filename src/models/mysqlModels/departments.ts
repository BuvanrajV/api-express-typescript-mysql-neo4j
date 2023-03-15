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


export const getDepartmentId = (department: string) => {
  const query = 'SELECT id from departments where department_name=?'
  return runQuery(query,department)
}


export const getDepartmentName = (departmentId : number)=>{
  const query='SELECT department_name from departments where id=?'
  return runQuery(query,departmentId)
}
