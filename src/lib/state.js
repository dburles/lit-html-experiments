import { render as _render } from 'https://unpkg.com/lit-html?module';

let _template;
let _element;

export const render = () => _render(_template(), _element);

export const eventState = fn => event => async args => {
  await fn(event, args);
  render();
};

export const boot = (template, element) => {
  _template = template;
  _element = element;
  render();
};
