import { html } from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';
import { GraphQLMutation } from './lib/graphql.js';
import { ratingsQuery, ratingsFragment } from './ratings-list.js';
import { render } from './lib/state.js';

const ratingsMutationQuery = GraphQLMutation({
  url: 'https://api.graph.cool/simple/v1/cjhr8g0an2ng50119f79tcz0u',
  query: `
    mutation createRating($title: String!) {
      createRating(title: $title) {
        ${ratingsFragment}
      }
    }
  `,
});

let submitting = false;

const onSubmit = async event => {
  event.preventDefault();
  const input = event.target.elements['title'];
  const title = input.value;

  submitting = true;
  render();

  const { data } = await ratingsMutationQuery.fetch({ variables: { title } });

  await ratingsQuery.refetch();
  // or:
  // ratingsQuery.setCache(cache => ({
  //   allRatings: [data.createRating, ...cache.allRatings],
  // }));

  submitting = false;
  render();
  input.value = '';
};

export const ratingsAdd = () => html`
<form on-submit=${onSubmit}>
  <label>Title</label>  
  <input type="text" name="title" autocomplete="off" />
  <button disabled=${submitting}>${submitting ? 'Saving...' : 'Add'}</button>
</form>
`;
