import { rest } from 'msw';

import userProfileJSON from './jsonPayloads/userProfile.json';
import allEntriesJSON from './jsonPayloads/allEntries.json';
import userSettings from './jsonPayloads/userSettings.json';

export const handlers = [
  rest.get('/api/loggedInUser', (_req, res, ctx) => {
    return res(ctx.json(userProfileJSON));
  }),
  rest.get('/api/allEntries', (_req, res, ctx) => {
    return res(ctx.json(allEntriesJSON));
  }),
  rest.get('/api/userSettings', (_req, res, ctx) => {
    return res(ctx.json(userSettings));
  }),
  rest.post('/api/userSettings', (_req, res, ctx) => {
    return res(ctx.json('ok'));
  }),
];
