const filterNames = [`overdue`, `today`, `favorites`, `repeating`, `archive`, `all`];
const generateFilters = () => {
  let totalCount = 0;
  return filterNames.map((it, index) => {
    let count = Math.floor(Math.random() * 10);
    if (index !== (filterNames.length - 1)) {
      totalCount += count;
    }
    if (index === (filterNames.length - 1)) {
      count = totalCount;
    }
    return {
      name: it,
      count,
    };
  });
};

export {generateFilters};
