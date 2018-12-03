import { config } from "dotenv";
import "babel-polyfill";
import $ from "jquery";

global.$ = global.jQuery = $;

config({ path: './.env' });

global.process = process;

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};

global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};

const xhrMockClass = () => ({
  open: jest.fn(),
  send: jest.fn(),
  onload: jest.fn(),
  setRequestHeader: jest.fn(),
});
global.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);

global.utag = {
  view: jest.fn(),
  link: jest.fn(),
};