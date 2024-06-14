type Args = {
  origin: { lat: number; lng: number };
  destination: { lat?: number; lng?: number };
};

export const calculateDistance = ({ origin, destination }: Args): string | undefined => {
  if (!destination.lat || !destination.lng) return undefined;
  const R = 6378137.0;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const rawDistance =
    R *
    Math.acos(
      Math.cos(rad(origin.lat)) * Math.cos(rad(destination.lat)) * Math.cos(rad(destination.lng) - rad(origin.lng)) +
        Math.sin(rad(origin.lat)) * Math.sin(rad(destination.lat))
    );

  const m = Math.floor(rawDistance);

  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`;
};
