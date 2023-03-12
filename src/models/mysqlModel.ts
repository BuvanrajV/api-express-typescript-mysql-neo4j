import mysqlDb from "../databases/mysqlDatabase";

interface UserDetails {
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_startdate: string;
  user_designation: string;
  user_created_date: Date;
  user_status: string;
}

export const getUserId = (email: { user_email: string }) => {
  return new Promise((resolve, reject) => {
    mysqlDb.query(
      "Select user_id from users where user_email=?",
      [email],
      (err, res) => {
        if (err) {
          console.error("error : ", err);
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

export const createUser = (userDetails: UserDetails) => {
  return new Promise((resolve, reject) => {
    mysqlDb.query("INSERT INTO users SET ?", [userDetails], (err, res) => {
      if (err) {
        console.error("error: ", err);
        reject(err);
      } else {
        resolve(userDetails);
      }
    });
  });
};
