"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

export default function Home() {
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  const onIdle = (map: google.maps.Map) => {
    setZoom(map.getZoom()!);
    setCenter(map.getCenter()!.toJSON());
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          window.alert("現在地を取得できませんでした。");
        }
      );
    } else {
      window.alert("現在地を取得できませんでした。");
    }
  }, []);

  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? ""}
      render={render}
    >
      <Map
        className="w-screen h-screen"
        center={center}
        onIdle={onIdle}
        zoom={zoom}
      />
    </Wrapper>
  );
}

interface MapProps extends google.maps.MapOptions {
  style?: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
  className?: string;
}

function Map({
  onClick,
  onIdle,
  children,
  style,
  className,
  ...options
}: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  useEffect(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  return <div ref={ref} id="map" style={style} className={className} />;
}
