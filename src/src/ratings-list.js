import { html } from 'https://unpkg.com/lit-html?module';
import { until } from 'https://unpkg.com/lit-html/directives/until.js?module';
import produce from 'https://unpkg.com/immer@1.3.1/dist/immer.module.js?module';
import { GraphQLQuery, GraphQLMutation } from './lib/graphql.js';
import { eventState, render } from './lib/state.js';
import transaction from './lib/graphql-transaction.js';
import { stars } from './star-rate.js';

const url = 'https://api.graph.cool/simple/v1/cjhr8g0an2ng50119f79tcz0u';

export const ratingsFragment = `
  id
  title
  rating
`;

export const ratingsQuery = GraphQLQuery({
  url,
  cache: true,
  query: `{
    allRatings {
      ${ratingsFragment}
    }
  }`,
});

ratingsQuery.subscribe(render);

let visible = true;
const toggleVisibility = eventState(() => {
  visible = !visible;
});

const removeMutation = GraphQLMutation({
  url,
  query: `
    mutation deleteRating($id: ID!) {
      deleteRating(id: $id) {
        id
      }
    }
  `,
});

let deletingId;

const onRemove = ratingId => async event => {
  deletingId = ratingId;

  await removeMutation.fetch({ variables: { id: ratingId } });
  await ratingsQuery.refetch();

  deletingId = undefined;
};

const rateMutation = GraphQLMutation({
  url,
  query: `
    mutation updateRating($id: ID! $rating: Int) {
      updateRating(id: $id rating: $rating) {
        id
        rating
      }
    }
  `,
});

const onRate = ratingId => value => async event => {
  const cache = ratingsQuery.getCache();
  const item = cache.data.allRatings.find(rating => rating.id === ratingId);

  const rating = item.rating === value ? 0 : value;

  ratingsQuery.setCache(c => ({
    allRatings: produce(c.allRatings, draft => {
      draft.forEach(item => {
        if (item.id === ratingId) {
          item.rating = rating;
        }
      });
    }),
  }));

  rateMutation.fetch({ variables: { id: ratingId, rating } });
};

const getRatings = async () => {
  const response = await ratingsQuery.fetch();

  return html`
    <table>
      ${response.data.allRatings.map(
        rating =>
          html`
            <tr>
              <td>${rating.title}</td>
              <td>${stars({
                onRate: onRate(rating.id),
                rating: rating.rating,
              })}</td>
              <td>
                <button @click={${onRemove(
                  rating.id,
                )}} ?disabled=${deletingId === rating.id}>
                  ${deletingId === rating.id ? 'Removing...' : 'Remove'}
                </button>
              </td>
            </tr>
          `,
      )}
    </table>
  `;
};

const refetch = async event => {
  await ratingsQuery.refetch();
};

export const ratingsList = () => html`
  <button @click=${toggleVisibility()}>
    ${visible ? 'Hide' : 'Show'}
  </button>

  ${visible ? until(getRatings(), html`<p>Loading...</p>`) : ''}

  <hr>
  
  <button @click=${refetch}>Refetch</button>
`;
