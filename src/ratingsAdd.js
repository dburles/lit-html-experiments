import { html } from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';
import GraphQL from './lib/graphql.js';
import { ratingsQuery, ratingsFragment } from './ratingsList.js';

const onSubmit = event => {
  event.preventDefault();

  const title = event.target.elements['title'].value;

  const ratingsMutationQuery = GraphQL({
    host: 'http://localhost:3010/graphql',
    operation: {
      query: `
        mutation addRating($title: String!) {
          addRating(title: $title) {
            ${ratingsFragment}
          }
        }
      `,
      variables: {
        title,
      },
    },
  });

  ratingsMutationQuery.fetch().then(data => {
    console.log('response', data);

    ratingsQuery.setCache(cache => ({
      data: { ratings: [data.data.addRating, ...cache.data.ratings] },
    }));
  });
};

export const ratingsAdd = () => html`
<form on-submit=${onSubmit}>
  <fieldset>
    <label>Title</label>  
    <input type="text" name="title" />
    <button>Add</button>
  </fieldset>
</form>
`;
