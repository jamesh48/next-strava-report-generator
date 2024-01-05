import { rest } from 'msw';

import userProfileJSON from './jsonPayloads/userProfile.json';
import allEntriesJSON from './jsonPayloads/allEntries.json';

export const handlers = [
  rest.get('/api/loggedInUser', (_req, res, ctx) => {
    return res(ctx.json(userProfileJSON));
  }),
  rest.get('/api/allEntries', (_req, res, ctx) => {
    return res(ctx.json(allEntriesJSON));
  }),
  rest.post('/api/userSettings', (_req, res, ctx) => {
    return res(ctx.json('ok'));
  }),
];
