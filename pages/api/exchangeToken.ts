import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const code = req.query.code;

  if (req.query.error === 'access_denied') {
    return res.redirect(`${process.env.REDIRECT_URI_HOST}/AccessDenied`);
  }

  try {
    const { data } = await axios(
      `${process.env.DATA_BASE_URL}/srg/exchange_token?code=${code}`
    );
    const futureDate = new Date(
      new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000
    ); // 10 years from now
    res.setHeader(
      'Set-Cookie',
      `athleteId=${data}; HttpOnly;Expires=${futureDate.toUTCString()}`
    );
    return res.redirect(process.env.REDIRECT_URI_HOST!);
  } catch (err: any) {
    return res.send(err);
  }
});

export default handler;
