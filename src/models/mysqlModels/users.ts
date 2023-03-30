import mysqlDb from '../../databases/mysql'

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

export const getUserId = (email: { user_email: string }) => {
  const query =
    'SELECT user_id FROM users WHERE user_email=? AND user_status="1"'
  return runQuery(query, email)
}

export const getCandidateById = (candidateId: number) => {
  const query = 'SELECT * FROM users WHERE user_candidate_id=? AND user_status="1"'
  return runQuery(query, candidateId)
}

export const createUser = (userDetails: UserDetails) => {
  const query = 'INSERT INTO users SET ?'
  return runQuery(query, userDetails)
}

export const updateUser = (candidateId: number, userDetails: UserDetails) => {
  const query = 'UPDATE users SET ? WHERE user_candidate_id=? AND user_status="1"'
  return runQuery(query, [userDetails, candidateId])
}

export const changeUserStatusInMysql = (candidateId: number) => {
  const query = 'UPDATE users SET user_status="0" WHERE user_candidate_id=?'
  return runQuery(query, candidateId)
}

export const checkEmail = (email: string, candidateId: number) => {
  const query =
    'SELECT * FROM users WHERE user_email=? AND user_candidate_id!=?'
  return runQuery(query, [email, candidateId])
}
