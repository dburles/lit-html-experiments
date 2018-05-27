const defaultRequestOptions = () => ({
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const GraphQLQuery = ({
  host,
  query,
  cache = true,
  requestOptionsOverride = defaultRequestOptions,
}) => {
  let _cache = {};
  let _variables = null;

  const fetcher = (options = {}) => {
    if (options.variables) {
      _variables = options.variables;
    }

    const request = new Request(host, {
      ...requestOptionsOverride(defaultRequestOptions),
      body: JSON.stringify({
        query,
        variables: _variables,
      }),
    });

    return fetch(request)
      .then(response => response.json())
      .then(data => {
        if (cache) {
          _cache = data;
        }
        return data;
      });
  };

  return {
    ...(cache && {
      setCache: cb => {
        _cache = cb(_cache);
      },
      getCache: () => _cache,
    }),
    fetch: options => {
      if (cache && _cache.data) {
        return new Promise(resolve => resolve(_cache));
      }
      return fetcher(options);
    },
    refetch: fetcher,
  };
};

export const GraphQLMutation = ({
  host,
  query,
  requestOptionsOverride = defaultRequestOptions,
}) => {
  const fetcher = (options = {}) => {
    const request = new Request(host, {
      ...requestOptionsOverride(defaultRequestOptions),
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
