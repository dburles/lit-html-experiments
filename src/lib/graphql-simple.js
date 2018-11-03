export default class GraphQL {
  constructor(host) {
    this.host = host;
  }

  query({ operation: { query, variables = null } }) {
    const request = new Request(this.host, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    return fetch(request).then(response => response.json());
  }
}
