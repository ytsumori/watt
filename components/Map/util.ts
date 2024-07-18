type Args = {
  current: { lat: number; lng: number };
  active: { lat?: number; lng?: number };
};

export const calculateDirection = ({ current, active }: Args) => {
  if (!active.lat || !active.lng) return;
  const north = Math.max(current.lat, active.lat);
  const south = Math.min(current.lat, active.lat);
  const east = Math.max(current.lng, active.lng);
  const west = Math.min(current.lng, active.lng);

  return { north, south, east, west };
};
