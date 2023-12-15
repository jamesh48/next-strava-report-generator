const path = require("path");
require("dotenv").config({ path: path.resolve("backend/configs/dotenv/.env") });
import nextConnect from "next-connect";
const handler = nextConnect();

handler.get((_req, res: any) => {
  res.send(process.env.AUTH_LINK);
});

export default handler;
