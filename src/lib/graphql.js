const defaultHost = '/graphql';
const defaultRequestOptions = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
const defaultFetchUserOptions = { variables: null };
const defaultFetchOptions = { fetchMore: false };

export const GraphQLQuery = ({
  host = defaultHost,
  query,
  cache = false,
  requestOptionsOverride = options => options,
}) => {
  let _cache = {};
  let _variables = null;

  const fetcher = (
    userOptions = defaultFetchUserOptions,
    options = defaultFetchOptions,
  ) => {
    if (userOptions.variables && !options.fetchMore) {
      _variables = userOptions.variables;
    }

    const request = new Request(host, {
      ...requestOptionsOverride(defaultRequestOptions),
      body: JSON.stringify({
        query,
        variables: options.fetchMore ? userOptions.variables : _variables,
      }),
    });

    return fetch(request)
      .then(response => response.json())
      .then(data => {
        if (cache && !options.fetchMore) {
          _cache = data;
        }
        return data;
      });
  };

  return {
    ...(cache && {
      setCache: cb => {
        _cache.data = cb(_cache.data);
      },
      getCache: () => _cache,
    }),
    fetch: (userOptions = defaultFetchUserOptions) => {
      if (
        cache &&
        Object.keys(_cache).length &&
        // If variables are unchanged from previous request
        JSON.stringify(userOptions.variables) === JSON.stringify(_variables)
      ) {
        console.log('returning cached');
        return new Promise(resolve => resolve(_cache));
      }
      console.log('returning fetched');
      return fetcher(userOptions);
    },
    refetch: fetcher,
    fetchMore: (userOptions = defaultFetchUserOptions) => {
      if (!cache) {
        throw Error('Cannot call `fetchMore` without cache');
      }
      return fetcher(userOptions, { fetchMore: true });
    },
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

    return fetch(request).then(response => response.json());
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
