import { calculateDistance } from "@/app/(user-app)/_util/calculateDistance";

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
