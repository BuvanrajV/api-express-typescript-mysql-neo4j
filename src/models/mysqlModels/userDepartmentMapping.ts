import mysqlDb from "../../databases/mysqlDatabase";

interface UserDetails {
  map_user_id: number;
  map_department_id: number;
  map_created_date: Date;
  map_status: string;
}

export const insertDetailsInUserdepartmentMapping = (
  userDetails: UserDetails
) => {
  return new Promise((resolve, reject) => {
    mysqlDb.query(
      "INSERT INTO user_department_mapping SET ?",
      [userDetails],
      (err, res) => {
        if (err) {
          console.error(err);
          reject();
        } else {
          resolve(res);
        }
      }
    );
  });
};