import { html } from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';
import { until } from 'https://unpkg.com/lit-html/lib/until.js?module';
import { GraphQLQuery, GraphQLMutation } from './lib/graphql.js';
import { updater, update } from './lib/state.js';
import transaction from './lib/graphql-transaction.js';

export const ratingsFragment = `
  id
  title
  rating
`;

export const ratingsQuery = GraphQLQuery({
  host: 'http://localhost:3010/graphql',
  cache: true,
  query: `
    query Ratings {
      ratings {
        ${ratingsFragment}
      }
    }
  `,
});

window.ratingsQuery = ratingsQuery;
window.update = update;

let visible = true;

const toggleVisibility = updater(() => {
  visible = !visible;
});

const onRemove = ratingId => event => {
  transaction({
    optimistic: true,
    mutation: GraphQLMutation({
      host: 'http://localhost:3010/graphql',
      query: `
        mutation removeRating($id: Int!) {
          removeRating(id: $id) {
            id
          }
        }
      `,
    }),
    options: { variables: { id: ratingId } },
    cache: {
      target: ratingsQuery,
      update: cache => ({
        ratings: cache.ratings.filter(item => item.id !== ratingId),
      }),
    },
    callback: update,
  });
};

const getRatings = async () => {
  const response = await ratingsQuery.fetch();

  return html`
      <ul>
        ${response.ratings.map(
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
    `;
};

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
