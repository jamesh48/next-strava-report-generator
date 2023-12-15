import database from "../../backend/src/database/config";
const withDatabase = () => {
  return (req: any, _res: any, next: any) => {
    req.db = database;
    next();
  };
};

export default withDatabase;
