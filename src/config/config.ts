import dotenv from 'dotenv'
dotenv.config()

export const port = process.env.PORT || 3010
export const mysqlConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_DB_USER,
  password: process.env.SQL_DB_PASSWORD,
  database: process.env.SQL_DB,
}
export const neo4jConfig = {
  url: process.env.NEO4J_DB_URL || '',
  user: process.env.NEO4J_DB_USER || '',
  password: process.env.NEO4J_DB_PASSWORD || '',
}

export const secretKey = process.env.SECRET_KEY || ''
