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

type Props = {
  restaurants: Restaurant[];
  selectedRestaurantID?: number;
  onRestaurantSelect?: (id: number) => void;
  defaultCenter: google.maps.LatLngLiteral;
};

export default function Map({
  restaurants,
  selectedRestaurantID,
  onRestaurantSelect,
  defaultCenter,
}: Props) {
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] =
    useState<google.maps.LatLngLiteral>(defaultCenter);

  useEffect(() => {
    const selectedRestaurant = restaurants.find(
      (restaurant) => restaurant.id === selectedRestaurantID
    );
    if (selectedRestaurant) {
      setCenter({
        lat: selectedRestaurant.latitude,
        lng: selectedRestaurant.longitude,
      });
    }
  }, [selectedRestaurantID, restaurants]);

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

  const handleRestaurantSelect = useCallback(
    (restaurantID: number) => {
      if (onRestaurantSelect) onRestaurantSelect(restaurantID);
    },
    [onRestaurantSelect]
  );

  // 現在地の取得
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position: GeolocationPosition) => {
  //         setCenter({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //       },
  //       () => {
  //         window.alert("現在地を取得できませんでした。");
  //       }
  //     );
  //   } else {
  //     window.alert("現在地を取得できませんでした。");
  //   }
  // }, []);

  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? ""}
      render={render}
    >
      <MapComponent
        center={center}
        onIdle={handleIdle}
        zoom={zoom}
        disableDefaultUI
        clickableIcons={false}
        style={{ height: "100%", width: "100%" }}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
            title={restaurant.name}
            selected={restaurant.id === selectedRestaurantID}
            onClick={() => {
              setCenter({
                lat: restaurant.latitude,
                lng: restaurant.longitude,
              });
              handleRestaurantSelect(restaurant.id);
            }}
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
}

function MapComponent({ onIdle, children, style, ...options }: MapProps) {
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
      <div ref={ref} id="map" style={style} />
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
          fillColor: "#0BC5EA",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#ffffff",
          scale: 3,
          anchor: new google.maps.Point(0, 20),
        };
        marker.setIcon(selectedIcon);
        marker.setZIndex(100);
      } else {
        const unselectedIcon: google.maps.Symbol = {
          path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
          fillColor: "white",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#0BC5EA",
          scale: 2,
          anchor: new google.maps.Point(0, 20),
        };
        marker.setIcon(unselectedIcon);
        marker.setZIndex(1);
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
