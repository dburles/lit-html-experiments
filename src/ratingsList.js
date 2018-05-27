import { html } from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';
import { until } from 'https://unpkg.com/lit-html/lib/until.js?module';
import { query, mutation } from './lib/graphql.js';
import { updater, update } from './lib/state.js';

export const ratingsFragment = `
  id
  title
  rating
`;

export const ratingsQuery = query({
  host: 'http://localhost:3010/graphql',
  query: `
    query Ratings {
      ratings {
        ${ratingsFragment}
      }
    }
  `,
});

window.ratingsQuery = ratingsQuery;

let visible = true;

const toggleVisibility = updater(() => {
  visible = !visible;
});

const onRemove = ratingId => event => {
  // Optimistic response
  ratingsQuery.setCache(cache => ({
    data: { ratings: cache.data.ratings.filter(item => item.id !== ratingId) },
  }));

  update();

  mutation({
    host: 'http://localhost:3010/graphql',
    query: `
      mutation removeRating($id: Int!) {
        removeRating(id: $id) {
          id
        }
      }
    `,
  }).fetch({ variables: { id: ratingId } });
};

const getRatings = () =>
  ratingsQuery.fetch().then(
    response => html`
      <ul>
      ${response.data.ratings.map(
        rating =>
          html`
          <li>
            ${rating.title} --
            ${rating.rating} --
            <button on-click={${onRemove(rating.id)}}>x</button>
          </li>
          `,
      )}
      </ul>
      `,
  );

const refetch = async event => {
  await ratingsQuery.refetch();
  update();
};

export const ratingsList = () => html`
  <button on-click=${toggleVisibility()}>
    ${visible ? 'Hide' : 'Show'}
  </button>

  ${visible ? until(getRatings(), html`<p>Loading...</p>`) : ''}
  <button on-click=${refetch}>Refetch</button>
`;
