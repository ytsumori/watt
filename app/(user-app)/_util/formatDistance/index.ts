export const formatDistance = (rawDistance: number) => {
  const m = Math.floor(rawDistance);

  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`;
};
