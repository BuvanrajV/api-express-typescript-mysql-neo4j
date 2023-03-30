import { runQuery } from '../../databases/mysql'

interface UserDetails {
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_startdate: string;
  user_designation: string;
  user_created_date: Date;
  user_status: string;
  user_candidate_id: number;
}

export const getUserId = (email: { user_email: string }) => {
  const query =
    'SELECT user_id FROM users WHERE user_email=? AND user_status="1"'
  return runQuery(query, email)
}

export const getCandidateById = (candidateId: number) => {
  const query =
    'SELECT user_id FROM users WHERE user_candidate_id=? AND user_status="1"'
  return runQuery(query, candidateId)
}

export const createUser = (userDetails: UserDetails) => {
  const {
    user_first_name,
    user_last_name,
    user_email,
    user_startdate,
    user_designation,
    user_created_date,
    user_status,
    user_candidate_id,
  } = userDetails
  const query = `INSERT INTO users 
    (user_first_name,user_last_name,user_email,user_startdate,user_designation,user_created_date,user_status,user_candidate_id) 
    VALUES (?,?,?,?,?,?,?,?)`
  return runQuery(query, [
    user_first_name,
    user_last_name,
    user_email,
    user_startdate,
    user_designation,
    user_created_date,
    user_status,
    user_candidate_id,
  ])
}

export const updateUser = (userId: number, userDetails: UserDetails) => {
  const query =
    'UPDATE users SET ? WHERE user_id=? AND user_status="1"'
  return runQuery(query, [userDetails, userId])
}

export const changeUserStatusInMysql = (userId: number) => {
  const query = 'UPDATE users SET user_status="0" WHERE user_id=?'
  return runQuery(query, userId)
}

export const checkEmail = (email: string, userId: number) => {
  const query =
    'SELECT * FROM users WHERE user_email=? AND user_id!=? AND user_status="1"'
  return runQuery(query, [email, userId])
}
