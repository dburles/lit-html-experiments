export default function GraphQL({
  host,
  operation: { query, variables = null },
  onCacheUpdate = () => {},
}) {
  const subscriptions = [];
  let cache = {};

  const body = JSON.stringify({
    query,
    variables,
  });

  const request = new Request(host, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  });

  return {
    setCache: cb => {
      cache = { ...cb(cache) };
      onCacheUpdate();
    },
    getCache: () => cache,
    request: () => {
      if (cache.data) {
        console.log('returning cached result', query);
        return new Promise(resolve => resolve(cache));
      }
      console.log('returning fetched result', query);
      return fetch(request)
        .then(response => response.json())
        .then(data => {
          cache = data;
          console.log('cached: ', cache);
          return data;
        });
    },
    subscribe(fn) {
      subscriptions.push(fn);
      return () => subscriptions.splice(subscriptions.indexOf(fn), 1);
    },
  };
}
