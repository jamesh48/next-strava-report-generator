import { rest } from 'msw';
export const handlers = [
  rest.get('/api/uv-sitrep', (_req, res, ctx) => {
    return res(ctx.json({}));
  }),
];
