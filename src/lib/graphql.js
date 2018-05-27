export default function GraphQL({
  host,
  operation: { query, variables = null },
}) {
  let cache = {};

  const fetcher = () => {
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
    fetch: () => {
      if (cache.data) {
        return new Promise(resolve => resolve(cache));
      }
      return fetcher();
    },
    refetch: fetcher,
  };
}
