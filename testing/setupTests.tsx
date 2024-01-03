import 'whatwg-fetch';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';
import { configure } from '@testing-library/dom';
import { server } from './MSW/server';

global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

beforeAll(() => {
  configure({ defaultHidden: true });
  if (process.env.TEST_ENV !== 'server') {
    // jsdom does not support the second argument passed into getComputedStyle.
    // Here I am overriding it to only pass in the first to suppress the
    // useless warnings.
    const { getComputedStyle } = window;
    window.getComputedStyle = (elt) => getComputedStyle(elt);
  }
  global.URL.createObjectURL = jest.fn(() => {
    return 'blob:https://stackoverflow.com/7032bf29-e2bd-46e8-89dd-877386d48eb3';
  });
  server.listen();
});

afterAll(() => server.close());
