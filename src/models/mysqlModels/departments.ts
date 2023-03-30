import { runQuery } from './../../databases/mysql'


export const createDepartment = (department: string) => {
  const query='INSERT INTO departments (department_name,department_status) VALUES (?,"1")'
  return runQuery(query,department)
}

export const getDepartmentId = (department: string) => {
  const query = 'SELECT id FROM departments WHERE department_name=?'
  return runQuery(query, department)
}

export const getDepartmentName = (departmentId: number) => {
  const query = 'SELECT department_name FROM departments WHERE id=?'
  return runQuery(query, departmentId)
}
