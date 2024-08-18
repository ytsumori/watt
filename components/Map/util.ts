import { calculateDistance } from "@/app/(user-app)/_util/calculateDistance";

export const calculatePixelDistance = (map: google.maps.Map) => {
  // マップの境界を取得
  const bounds = map.getBounds();
  if (!bounds) return;
  const { lat: north, lng: east } = bounds.getNorthEast().toJSON();
  const { lat: south, lng: west } = bounds.getSouthWest().toJSON();

  const mapHeight = calculateDistance({ origin: { lat: north, lng: east }, destination: { lat: south, lng: east } });
  const mapWidth = calculateDistance({ origin: { lat: north, lng: east }, destination: { lat: north, lng: west } });

  if (!mapHeight || !mapWidth) return;

  // map要素のサイズを取得
  const mapElement = map.getDiv();
  const mapWidthPixels = mapElement.offsetWidth;
  const mapHeightPixels = mapElement.offsetHeight;

  // 1ピクセルあたりの距離を計算
  const metersPerPixelWidth = mapWidth.raw / mapWidthPixels;
  const metersPerPixelHeight = mapHeight.raw / mapHeightPixels;

  return { perWidth: metersPerPixelWidth, perHeight: metersPerPixelHeight };
};

type CalculateMarkerCoordinatesArgs = {
  marker: { w: number; h: number; coordinate: { lat: number; lng: number } };
  perPixelDistance: { perWidth: number; perHeight: number };
};

export const calculateMarkerCoordinates = ({ marker, perPixelDistance }: CalculateMarkerCoordinatesArgs) => {
  // markerの大きさ
  const { w, h, coordinate } = marker;
  // 1pxあたりの距離
  const { perWidth, perHeight } = perPixelDistance;
  // 1mあたりの緯度経度
  const oneMeterLatJP = 0.000008983148616;
  const oneMeterLngJP = 0.000010966382364;

  const lat = h * perHeight * oneMeterLatJP;
  const lng = w * perWidth * oneMeterLngJP;

  return [
    { type: "origin", lat: coordinate.lat, lng: coordinate.lng },
    { type: "top", lat: Number((coordinate.lat + lat).toFixed(6)), lng: coordinate.lng },
    { type: "right", lat: coordinate.lat, lng: Number((coordinate.lng + lng / 2).toFixed(6)) },
    { type: "left", lat: coordinate.lat, lng: Number((coordinate.lng - lng / 2).toFixed(6)) }
  ];
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
