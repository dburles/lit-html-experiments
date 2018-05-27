import {
  html,
  render,
} from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';
import { until } from 'https://unpkg.com/lit-html/lib/until.js?module';
import GraphQL1 from './lib/graphql.js';
import GraphQL2 from './lib/graphql-internal-cache.js';
import './elements/index.js';
import { boot, updater, update } from './lib/state.js';

const client = new GraphQL2('http://localhost:3010/graphql');

const ratingsQuery = GraphQL1({
  host: 'http://localhost:3010/graphql',
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
  onCacheUpdate: update,
});

window.ratingsQuery = ratingsQuery;

const getRatings1 = () =>
  ratingsQuery
    .request()
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
