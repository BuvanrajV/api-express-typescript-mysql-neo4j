import mysql from 'mysql2/promise'
import { mysqlConfig } from '../config/config'

const { host, user, password, database } = mysqlConfig

export const mysqlDb = mysql.createPool({
  connectionLimit: 100,
  host: host,
  user: user,
  password: password,
  database: database,
})

export const runQuery = async (query: string, input: any) => {
  try{
    return await mysqlDb.query(query, input)
  }catch(err){
    console.error(err)
  }
}
