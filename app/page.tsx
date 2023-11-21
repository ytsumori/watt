"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? ""}
      render={render}
    >
      <Map />
    </Wrapper>
  );
}

function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: {
            lat: 35.6809591,
            lng: 139.7673068,
          },
          zoom: 8,
        })
      );
    }
  }, [ref, map]);

  return <div ref={ref} id="map" className="w-screen h-screen" />;
}
