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
  const query = 'SELECT id FROM departments WHERE department_name=?'
  return runQuery(query,department)
}


export const getDepartmentName = (departmentId : number)=>{
  const query='SELECT department_name FROM departments WHERE id=?'
  return runQuery(query,departmentId)
}
