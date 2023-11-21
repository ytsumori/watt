"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { info } from "console";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const RESTAURANTS: { label: string; position: { lat: number; lng: number } }[] =
  [
    {
      label: "麺や 佑",
      position: {
        lat: 34.67956198719484,
        lng: 135.49836252860987,
      },
    },
    {
      label: "豆腐料理 空野 南船場店",
      position: {
        lat: 34.67938072701062,
        lng: 135.49894236575275,
      },
    },
  ];

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
      >
        {RESTAURANTS.map((restaurant, index) => (
          <Marker
            key={index}
            position={restaurant.position}
            title={restaurant.label}
            clickable
          />
        ))}
      </Map>
    </Wrapper>
  );
}

interface MapProps extends google.maps.MapOptions {
  style?: { [key: string]: string };
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
  className?: string;
}

function Map({ onIdle, children, style, className, ...options }: MapProps) {
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

  return (
    <>
      <div ref={ref} id="map" style={style} className={className} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return cloneElement(child, { map });
        }
      })}
    </>
  );
}

function Marker(options: google.maps.MarkerOptions) {
  const [marker, setMarker] = useState<google.maps.Marker>();
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();

  useEffect(() => {
    if (!infoWindow) {
      setInfoWindow(new google.maps.InfoWindow());
    }
  }, [infoWindow]);

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
      if (infoWindow) {
        marker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent(options.title);
          infoWindow.open(marker.getMap(), marker);
        });
      }
    }
  }, [marker, options, infoWindow]);
  return null;
}
