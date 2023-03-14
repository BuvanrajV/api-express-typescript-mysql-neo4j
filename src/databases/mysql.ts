import mysql from 'mysql2'
import { mysqlConfig } from '../config/config'

const { host, user, password, database } = mysqlConfig

const mysqlDb = mysql.createPool({
  connectionLimit: 100,
  host: host,
  user: user,
  password: password,
  database: database,
})

export default mysqlDb
