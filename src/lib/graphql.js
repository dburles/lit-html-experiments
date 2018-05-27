export default function GraphQL({
  host,
  operation: { query, variables = null },
  onCacheUpdate = () => {},
}) {
  let cache = {};

  const body = JSON.stringify({
    query,
    variables,
  });

  const fetcher = () => {
    const request = new Request(host, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });

    console.log('returning fetched result', query);
    return fetch(request)
      .then(response => response.json())
      .then(data => {
        cache = data;
        console.log('cached: ', cache);
        return data;
      });
  };

  return {
    setCache: cb => {
      cache = cb(cache);
      onCacheUpdate();
    },
    getCache: () => cache,
    fetch: () => {
      if (cache.data) {
        console.log('returning cached result', query);
        return new Promise(resolve => resolve(cache));
      }
      return fetcher();
    },
    refetch: () =>
      fetcher().then(data => {
        onCacheUpdate();
        return data;
      }),
  };
}
