"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from "react";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

type Props = {
  restaurants: { id: string; name: string; location: google.maps.LatLngLiteral }[];
  activeRestaurantIds: string[];
  onRestaurantSelect?: (restaurantId: string) => void;
};

const CENTER_POSITION: google.maps.LatLngLiteral = {
  lat: 34.70726721576163,
  lng: 135.51175158248128,
};

export default function Map({ restaurants, activeRestaurantIds, onRestaurantSelect }: Props) {
  const [zoom, setZoom] = useState(16);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>();

  const handleIdle = useCallback(
    (map: google.maps.Map) => {
      if (zoom !== map.getZoom()) {
        setZoom(map.getZoom()!);
      }
    },
    [zoom]
  );

  const handleRestaurantSelect = useCallback(
    (restaurantID: string) => {
      if (onRestaurantSelect) onRestaurantSelect(restaurantID);
    },
    [onRestaurantSelect]
  );

  // get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Error getting current location");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  }, []);

  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? ""} render={render} libraries={["places"]}>
      <MapComponent
        center={CENTER_POSITION}
        onIdle={handleIdle}
        zoom={zoom}
        disableDefaultUI
        clickableIcons={false}
        style={{ height: "100%", width: "100%" }}
      >
        {restaurants.map((restaurant) => (
          <RestaurantMarker
            key={restaurant.id}
            location={restaurant.location}
            title={restaurant.name}
            isActive={activeRestaurantIds.includes(restaurant.id)}
            onClick={() => handleRestaurantSelect(restaurant.id)}
            clickable
          />
        ))}
        {currentLocation && <CurrentLocationMarker position={currentLocation} />}
      </MapComponent>
    </Wrapper>
  );
}

interface MapProps extends google.maps.MapOptions {
  style?: { [key: string]: string };
  onIdle: (map: google.maps.Map) => void;
  children?: React.ReactNode;
  currentPlaceId?: string;
}

function MapComponent({ onIdle, children, style, currentPlaceId, ...options }: MapProps) {
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

interface CurrentLocationMarkerProps extends google.maps.MarkerOptions {
  position: google.maps.LatLngLiteral;
}

function CurrentLocationMarker({ position, ...options }: CurrentLocationMarkerProps) {
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
      marker.setOptions(options);
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#0080FF",
        fillOpacity: 1,
        strokeColor: "#0080FF",
        strokeOpacity: 0.3,
        strokeWeight: 15,
      });
    }
  }, [marker, options]);

  useEffect(() => {
    if (marker) {
      marker.setPosition(new google.maps.LatLng(position));
    }
  }, [marker, position]);

  return null;
}

interface MarkerProps extends google.maps.MarkerOptions {
  location: google.maps.LatLngLiteral;
  isActive: boolean;
  onClick: () => void;
}

function RestaurantMarker({ location, isActive, onClick, ...options }: MarkerProps) {
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
      if (isActive) {
        const activeIcon: google.maps.Symbol = {
          path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
          fillColor: "#EFA039",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "white",
          scale: 3,
          anchor: new google.maps.Point(0, 20),
        };
        marker.setIcon(activeIcon);
        marker.setZIndex(100);
      } else {
        const inactiveIcon: google.maps.Symbol = {
          path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
          fillColor: "white",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#EFA039",
          scale: 2,
          anchor: new google.maps.Point(0, 20),
        };
        marker.setIcon(inactiveIcon);
        marker.setZIndex(1);
      }
    }
  }, [marker, isActive]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  useEffect(() => {
    if (marker) {
      google.maps.event.clearListeners(marker, "click");
      marker.addListener("click", onClick);
    }
  }, [marker, onClick]);

  useEffect(() => {
    if (marker) {
      marker.setPosition(location);
    }
  }, [marker, location]);
  return null;
}
