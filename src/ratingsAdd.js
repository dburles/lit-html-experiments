import { html } from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';
import { GraphQLMutation } from './lib/graphql.js';
import { ratingsQuery, ratingsFragment } from './ratingsList.js';
import { update } from './lib/state.js';

const onSubmit = async event => {
  event.preventDefault();
  const input = event.target.elements['title'];
  const title = input.value;

  const ratingsMutationQuery = GraphQLMutation({
    host: 'http://localhost:3010/graphql',
    query: `
      mutation addRating($title: String!) {
        addRating(title: $title) {
          ${ratingsFragment}
        }
      }
    `,
  });

  const data = await ratingsMutationQuery.fetch({ variables: { title } });

  ratingsQuery.setCache(cache => ({
    data: { ratings: [data.data.addRating, ...cache.data.ratings] },
  }));

  update();
  input.value = '';
};

export const ratingsAdd = () => html`
<form on-submit=${onSubmit}>
  <fieldset>
    <label>Title</label>  
    <input type="text" name="title" autocomplete="off" />
    <button>Add</button>
  </fieldset>
</form>
`;
