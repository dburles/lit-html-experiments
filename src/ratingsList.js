import { html } from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';
import { until } from 'https://unpkg.com/lit-html/lib/until.js?module';
import GraphQL from './lib/graphql.js';
import { updater, update } from './lib/state.js';

export const ratingsFragment = `
  id
  title
  rating
`;

export const ratingsQuery = GraphQL({
  host: 'http://localhost:3010/graphql',
  operation: {
    query: `
        query Ratings {
          ratings {
            ${ratingsFragment}
          }
        }
      `,
  },
  onCacheUpdate: update,
});

window.ratingsQuery = ratingsQuery;

let visible = true;

const toggleVisibility = updater(() => {
  visible = !visible;
});

const getRatings = () =>
  ratingsQuery
    .fetch()
    .then(
      response =>
        html`<ul>${response.data.ratings.map(
          rating => html`<li>${rating.title} -- ${rating.rating}</li>`,
        )}</ul>`,
    );

export const ratingsList = () => html`
  <button on-click=${toggleVisibility()}>
    ${visible ? 'Hide' : 'Show'}
  </button>

  ${visible ? until(getRatings(), html`<p>Loading...</p>`) : ''}
  <button on-click=${() => ratingsQuery.refetch()}>Refetch</button>
`;
