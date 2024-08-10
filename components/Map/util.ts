import { calculateDistance } from "@/app/(user-app)/_util/calculateDistance";

export const shrinkBounds = (map: google.maps.Map) => {
  if (!map) return;
  const bounds = map.getBounds();
  const center = map.getCenter();

  if (!bounds || !center) return map.getBounds();

  const zoomLevel = map.getZoom();

  if (!zoomLevel) return map.getBounds();

  const calculatePercentage = (zoom: number) => {
    if (zoom >= 16) return 0.08;
    if (zoom >= 12) return 0.1;
    if (zoom >= 8) return 0.12;
    return 0.16;
  };

  const percentage = calculatePercentage(zoomLevel);

  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  const latRange = ne.lat() - sw.lat();
  const lngRange = ne.lng() - sw.lng();

  const percentLat = latRange * percentage;
  const percentLng = lngRange * percentage;

  const latDiff = Number(percentLat.toFixed(6));
  const lngDiff = Number(percentLng.toFixed(6));

  const direction = bounds.toJSON();

  return new google.maps.LatLngBounds({
    north: direction.north - latDiff,
    east: direction.east - lngDiff,
    south: direction.south + latDiff,
    west: direction.west + lngDiff
  });
};

export type SetCenterArgs = {
  current?: google.maps.LatLngLiteral;
  active: google.maps.LatLngLiteral;
  setCenter: (center: google.maps.LatLngLiteral) => void;
  setZoom: (zoom: number) => void;
};

export const setFirstCenter = ({ current, active, setCenter, setZoom }: SetCenterArgs) => {
  if (current) {
    const distance = calculateDistance({ origin: current, destination: active });
    if (distance && distance.raw > 1000) {
      setZoom(15);
      setCenter(active);
    } else {
      setZoom(15);
      const center = { lat: (current.lat + active.lat) / 2, lng: (current.lng + active.lng) / 2 };
      setCenter(center);
    }
  } else {
    setZoom(15);
    setCenter(active);
  }
};
