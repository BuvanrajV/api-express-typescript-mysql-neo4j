import mysql from 'mysql2'
import { mysqlConfig } from '../config/config'

const { host, user, password, database } = mysqlConfig

export const mysqlDb = mysql.createPool({
  connectionLimit: 100,
  host: host,
  user: user,
  password: password,
  database: database,
})

export const runQuery = (query: string, input: any) => {
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
