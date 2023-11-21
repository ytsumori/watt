"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Restaurant } from "@prisma/client";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
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
  const [selectedRestaurantID, setSelectedRestaurantID] = useState<number>();

  const handleIdle = useCallback(
    (map: google.maps.Map) => {
      if (zoom !== map.getZoom()) {
        setZoom(map.getZoom()!);
      }
      if (
        JSON.stringify(center) !== JSON.stringify(map.getCenter()!.toJSON())
      ) {
        setCenter(map.getCenter()!.toJSON());
      }
    },
    [center, zoom]
  );

  const handleRestaurantSelect = useCallback((restaurantID: number) => {
    setSelectedRestaurantID(restaurantID);
  }, []);

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
        onIdle={handleIdle}
        zoom={zoom}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
            title={restaurant.name}
            selected={restaurant.id === selectedRestaurantID}
            onClick={() => handleRestaurantSelect(restaurant.id)}
            clickable
          />
        ))}
      </MapComponent>
    </Wrapper>
  );
}

interface MapProps extends google.maps.MapOptions {
  style?: { [key: string]: string };
  onIdle: (map: google.maps.Map) => void;
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

  useEffect(() => {
    if (map) {
      google.maps.event.clearListeners(map, "idle");
      map.addListener("idle", () => onIdle(map));
    }
  }, [map, onIdle]);

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

interface MarkerProps extends google.maps.MarkerOptions {
  selected: boolean;
  onClick: () => void;
}

function Marker({ selected, onClick, ...options }: MarkerProps) {
  const [marker, setMarker] = useState<google.maps.Marker>();
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();

  const handleClick = useCallback(onClick, [onClick]);

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
      if (selected) {
        const selectedIcon: google.maps.Symbol = {
          path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
          fillColor: "blue",
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 2,
          anchor: new google.maps.Point(0, 20),
        };
        marker.setIcon(selectedIcon);
      } else {
        marker.setIcon(undefined);
      }
    }
  }, [marker, selected]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  useEffect(() => {
    if (marker) {
      google.maps.event.clearListeners(marker, "click");
      marker.addListener("click", () => {
        onClick();
      });
    }
  }, [marker, onClick]);
  return null;
}
