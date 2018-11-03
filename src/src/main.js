import {
  html,
} from 'https://unpkg.com/lit-html?module';
// import './elements/index.js';
import { boot } from './lib/state.js';
import { ratingsAdd } from './ratings-add.js';
import { ratingsList } from './ratings-list.js';

const App = () => html`
  ${ratingsAdd()}
  <hr>
  ${ratingsList()}
`;

boot(App, document.getElementById('root'));
