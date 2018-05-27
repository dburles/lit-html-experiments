export const query = ({ host, query }) => {
  let cache = {};
  let variables = null;

  const fetcher = (options = {}) => {
    if (options.variables) {
      variables = options.variables;
    }

    const request = new Request(host, {
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

    return fetch(request)
      .then(response => response.json())
      .then(data => {
        cache = data;
        return data;
      });
  };

  return {
    setCache: cb => {
      cache = cb(cache);
    },
    getCache: () => cache,
    fetch: (options = {}) => {
      if (cache.data) {
        return new Promise(resolve => resolve(cache));
      }
      return fetcher(options);
    },
    refetch: fetcher,
  };
};

export const mutation = ({ host, query }) => {
  const fetcher = (options = {}) => {
    const request = new Request(host, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: options.variables,
      }),
    });

    return fetch(request).then(response => response.json());
  };

  return {
    fetch: fetcher,
  };
};
