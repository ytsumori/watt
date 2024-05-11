type Args = {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
};

export const calculateDistance = ({ origin, destination }: Args) => {
  const R = 6378137.0;
  const rad = (deg: number) => (deg * Math.PI) / 180;

  return (
    R *
    Math.acos(
      Math.cos(rad(origin.lat)) * Math.cos(rad(destination.lat)) * Math.cos(rad(destination.lng) - rad(origin.lng)) +
        Math.sin(rad(origin.lat)) * Math.sin(rad(destination.lat))
    )
  );
};
