import {
  html,
  render,
} from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';
import { until } from 'https://unpkg.com/lit-html/lib/until.js?module';
import GraphQL from './lib/graphql.js';
import './elements/index.js';
import { boot, updater } from './lib/state.js';

const client = new GraphQL('http://localhost:3010/graphql');

const getRatings1 = () =>
  client
    .query({
      operation: {
        query: `
          query Ratings {
            ratings {
              id
              title
              rating
            }
          }
        `,
      },
    })
    .then(
      response =>
        html`<ul>${response.data.ratings.map(
          rating => html`<li>${rating.title} -- ${rating.rating}</li>`,
        )}</ul>`,
    );

const getRatings2 = () =>
  client
    .query({
      operation: {
        query: `
            query Ratings {
              ratings {
                title
              }
            }
          `,
      },
    })
    .then(
      response =>
        html`<ul>${response.data.ratings.map(
          rating => html`<li>${rating.title}</li>`,
        )}</ul>`,
    );

let visible = true;

const toggleVisibility = updater(() => {
  visible = !visible;
});

const App = () =>
  html`
  <button on-click=${toggleVisibility()}>
    ${visible ? 'Hide' : 'Show'}
  </button>

  ${visible ? until(getRatings1(), html`<h2>Loading 1...</h2>`) : ''}
  ${visible ? until(getRatings2(), html`<h2>Loading 2...</h2>`) : ''}
`;

boot(App, document.getElementById('root'));
