import fn1va from './fn1va.js';

export default class GraphQL {
  constructor(host) {
    this.host = host;
    this.cache = {};
  }

  query({ operation: { query, variables = null } }) {
    const body = JSON.stringify({
      query,
      variables,
    });

    const hash = fn1va(body);

    if (this.cache[hash]) {
      console.log('fetching from cache: ', this.cache[hash]);
      return new Promise(resolve => resolve(this.cache[hash]));
    }

    const request = new Request(this.host, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });

    return fetch(request)
      .then(response => response.json())
      .then(data => {
        this.cache[hash] = data;
        console.log('cached: ', this.cache[hash]);
        return data;
      });

    // return fetch(request).then(response => response.json());
  }
}
