"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { calculateDirection } from "./util";
import { RestaurantStatus } from "@/utils/restaurant-status";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

type Props = {
  restaurants: { id: string; name: string; location: google.maps.LatLngLiteral; status: RestaurantStatus }[];
  activeRestaurant: { id: string; name: string; location: { lat: number; lng: number } } | null;
  currentLocation?: { lat: number; lng: number };
  onRestaurantSelect?: (restaurantId: string) => void;
};

const CENTER_POSITION: google.maps.LatLngLiteral = {
  lat: 34.67936936944665,
  lng: 135.4961399413188
};

export default function Map({ restaurants, activeRestaurant, currentLocation, onRestaurantSelect }: Props) {
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(CENTER_POSITION);

  const handleIdle = (map: google.maps.Map) => {
    setZoom(map.getZoom()!);
    setCenter(map.getCenter()!.toJSON());
  };

  const handleRestaurantSelect = (restaurantID: string) => {
    if (onRestaurantSelect) onRestaurantSelect(restaurantID);
  };

  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? ""} render={render} libraries={["places"]}>
      <MapComponent
        mapId={process.env.NEXT_PUBLIC_MAP_ID}
        center={center}
        onIdle={handleIdle}
        setZoom={setZoom}
        zoom={zoom}
        disableDefaultUI
        active={activeRestaurant?.location}
        current={currentLocation}
        clickableIcons={false}
        style={{ height: "100%", width: "100%" }}
      >
        {restaurants.map((restaurant) => (
          <RestaurantMarker
            key={restaurant.id}
            location={restaurant.location}
            title={restaurant.name}
            active={activeRestaurant?.id === restaurant.id}
            status={restaurant.status}
            onClick={() => handleRestaurantSelect(restaurant.id)}
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
  active?: { lat: number; lng: number };
  current?: { lat: number; lng: number };
  setZoom: (zoom: number) => void;
}

function MapComponent({ onIdle, children, style, active, current, setZoom, ...options }: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (ref.current && !map) {
      const map = new window.google.maps.Map(ref.current, {});
      setMap(map);
    }
  }, [ref, map]);

  useEffect(() => {
    if (!map || !active) return;
    if (isFirst && current && active) {
      const direction = calculateDirection({ current, active });
      const sw = new google.maps.LatLng({ lat: direction.south, lng: direction.west });
      const ne = new google.maps.LatLng({ lat: direction.north, lng: direction.east });
      map.fitBounds(new google.maps.LatLngBounds(sw, ne), 60);
      setIsFirst(false);
    }

    if (current) {
      const bounds = map.getBounds();
      if (!bounds?.contains({ lat: active.lat, lng: active.lng })) {
        const extendBounds = bounds?.extend(active);
        extendBounds && map.fitBounds(extendBounds, 60);
      }
    } else {
      const activePos = new google.maps.LatLng(active.lat, active.lng);
      map.panToBounds(new google.maps.LatLngBounds(activePos));
      map.setZoom(16);
      map.panTo(activePos);
    }
  }, [active, current, isFirst, map, setZoom]);

  useDeepCompareEffectForMaps(() => map && map.setOptions({ ...options }), [map, options]);

  useEffect(() => {
    if (map) {
      google.maps.event.clearListeners(map, "idle");
      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
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
        strokeWeight: 15
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
  active: boolean;
  status: RestaurantStatus;
  onClick: () => void;
}

const ACTIVE_ICON_PATH =
  "M7 10C8.5 10 10 8.5 10 7C10 5.5 8.5 4 7 4C5.5 4 4 5.5 4 7C4 8.5 5.5 10 7 10ZM7.00016 0C8.93749 0 10.5858 0.679667 11.9452 2.039C13.3045 3.39833 13.9842 5.04667 13.9842 6.984C13.9842 7.95267 13.7418 9.062 13.2572 10.312C12.7725 11.562 12.1865 12.734 11.4992 13.828C10.8118 14.922 10.1322 15.9453 9.46016 16.898C8.78816 17.8507 8.21783 18.6083 7.74916 19.171L6.99916 19.968C6.81183 19.7493 6.56183 19.4603 6.24916 19.101C5.93649 18.7417 5.37383 18.023 4.56116 16.945C3.74849 15.867 3.03749 14.82 2.42816 13.804C1.81883 12.788 1.26416 11.6397 0.76416 10.359C0.26416 9.07833 0.0141602 7.95333 0.0141602 6.984C0.0141602 5.04667 0.693827 3.39833 2.05316 2.039C3.41249 0.679667 5.06083 0 6.99816 0L7.00016 0Z";

const INACTIVE_ICON_PATH =
  "M6.986 0C8.92333 0 10.5717 0.679667 11.931 2.039C13.2903 3.39833 13.97 5.04667 13.97 6.984C13.97 7.95267 13.7277 9.062 13.243 10.312C12.7583 11.562 12.1723 12.734 11.485 13.828C10.7977 14.922 10.118 15.9453 9.446 16.898C8.774 17.8507 8.20367 18.6083 7.735 19.171L6.985 19.968C6.79767 19.7493 6.54767 19.4603 6.235 19.101C5.92233 18.7417 5.35967 18.023 4.547 16.945C3.73433 15.867 3.02333 14.82 2.414 13.804C1.80467 12.788 1.25 11.6397 0.75 10.359C0.25 9.07833 0 7.95333 0 6.984C0 5.04667 0.679667 3.39833 2.039 2.039C3.39833 0.679667 5.04667 0 6.984 0L6.986 0Z";

function RestaurantMarker({ location, active, status, onClick, ...options }: MarkerProps) {
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
      switch (status) {
        case "open":
          marker.setIcon({
            path: active ? ACTIVE_ICON_PATH : INACTIVE_ICON_PATH,
            fillColor: "#FF5850",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white",
            scale: active ? 3 : 2,
            anchor: new google.maps.Point(7, 20)
          });
          marker.setZIndex(active ? google.maps.Marker.MAX_ZINDEX : 1);
          break;
        case "close":
          marker.setIcon({
            path: active ? ACTIVE_ICON_PATH : INACTIVE_ICON_PATH,
            fillColor: "lightGray",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "gray",
            scale: active ? 2 : 1.5,
            anchor: new google.maps.Point(7, 20)
          });
          marker.setZIndex(active ? google.maps.Marker.MAX_ZINDEX : 0);
          break;
        case "full":
          marker.setIcon({
            path: active ? ACTIVE_ICON_PATH : INACTIVE_ICON_PATH,
            fillColor: "white",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FF5850",
            scale: active ? 3 : 2,
            anchor: new google.maps.Point(7, 20)
          });
          marker.setZIndex(active ? google.maps.Marker.MAX_ZINDEX : 1);
          break;
      }
    }
  }, [marker, active, status]);

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

const deepCompareEqualsForMaps = createCustomEqual({
  createInternalComparator: (deepEqual) => (a, b, _indexOrKeyA, _indexOrKeyB, _parentA, _parentB, state) => {
    if (
      isLatLngLiteral(a) ||
      a instanceof google.maps.LatLng ||
      isLatLngLiteral(b) ||
      b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    // use fast-equals for other objects
    return deepEqual(a, b, state);
  }
});

function useDeepCompareMemoize(value: any) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(callback: React.EffectCallback, dependencies: any[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
