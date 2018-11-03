const transaction = async ({
  optimistic = false,
  mutation,
  options,
  cache: { target, update },
  callback,
}) => {
  const cache = target.getCache();

  if (optimistic) {
    target.setCache(update);
    callback();
  }

  try {
    const data = await mutation.fetch(options);

    if (data.errors) {
      target.setCache(() => ({ ...cache }));
      callback(data.errors[0].message);
    } else if (!optimistic) {
      target.setCache(update(data));
      callback();
    }
    // optimistic transactions don't care about the returned data
  } catch (error) {
    // XXX: What are we dealing with here?
    // console.log(error);
    target.setCache(() => ({ ...cache }));
    callback(error);
  }
};

export default transaction;
