require('dotenv').config();
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
const handler = nextConnect();

handler.get((_req: NextApiRequest, res: NextApiResponse) => {
  const authLink = `https://www.strava.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI_HOST}/api/exchangeToken&approval_prompt=force&scope=profile:read_all,activity:read_all,activity:write`;

  res.send(authLink);
});

export default handler;
