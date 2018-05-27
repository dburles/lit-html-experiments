import {
  html,
  render,
} from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';
import GraphQL from './lib/graphql.js';
import './elements/index.js';
import { boot } from './lib/state.js';
import { ratingsAdd } from './ratingsAdd.js';
import { ratingsList } from './ratingsList.js';

const App = () => html`
  ${ratingsAdd()}
  <hr>
  ${ratingsList()}
`;

boot(App, document.getElementById('root'));
