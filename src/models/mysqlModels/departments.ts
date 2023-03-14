import mysqlDb from '../../databases/mysql'

export const getDepartmentId = (department: string) => {
  return new Promise((resolve, reject) => {
    mysqlDb.query(
      'SELECT id from departments where department_name=?',
      [department],
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
