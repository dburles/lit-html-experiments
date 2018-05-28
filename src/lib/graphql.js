const defaultHost = '/graphql';
const defaultRequestOptions = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const GraphQLQuery = ({
  host = defaultHost,
  query,
  cache = true,
  requestOptionsOverride = options => options,
}) => {
  let _cache = {};
  let _variables = null;

  const fetcher = (options = { variables: null, fetchMore: false }) => {
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
      .then(({ data }) => {
        if (cache && !options.fetchMore) {
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
    fetch: (options = {}) => {
      if (
        cache &&
        Object.keys(_cache).length &&
        // If variables are unchanged from previous request
        JSON.stringify(options.variables) === JSON.stringify(_variables)
      ) {
        console.log('returning cached');
        return new Promise(resolve => resolve(_cache));
      }
      console.log('returning fetched');
      return fetcher(options);
    },
    refetch: fetcher,
    fetchMore: options => fetcher({ ...options, fetchMore: true }),
    options: {
      host,
      query,
      cache,
      requestOptionsOverride,
    },
  };
};

export const GraphQLMutation = ({
  host = defaultHost,
  query,
  requestOptionsOverride = options => options,
}) => {
  const fetcher = (options = {}) => {
    const request = new Request(host, {
      ...requestOptionsOverride(defaultRequestOptions),
      body: JSON.stringify({
        query,
        variables: options.variables,
      }),
    });

    return fetch(request)
      .then(response => response.json())
      .then(({ data }) => data);
  };

  return {
    fetch: fetcher,
    options: {
      host,
      query,
      requestOptionsOverride,
    },
  };
};
