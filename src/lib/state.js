import { render } from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';

let _template;
let _element;

const update = () => render(_template(), _element);

export const updater = fn => event => args => {
  fn(event, args);
  update();
};

export const boot = (template, element) => {
  _template = template;
  _element = element;
  update();
};
