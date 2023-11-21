"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Restaurant } from "@prisma/client";
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

export default function Map({ restaurants }: { restaurants: Restaurant[] }) {
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 34.67932578786201,
    lng: 135.4961550080261,
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
      <MapComponent
        className="w-screen h-screen"
        center={center}
        onIdle={onIdle}
        zoom={zoom}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
            title={restaurant.name}
            clickable
          />
        ))}
      </MapComponent>
    </Wrapper>
  );
}

interface MapProps extends google.maps.MapOptions {
  style?: { [key: string]: string };
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
  className?: string;
}

function MapComponent({
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
