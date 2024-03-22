"use client";

import { getGoogleMapUrl } from "@/lib/places-api";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";

type Props = {
  googleMapPlaceId: string;
};

export function GoogleMapLink({ googleMapPlaceId }: Props) {
  const [googleMapUrl, setGoogleMapUrl] = useState<string>();

  useEffect(() => {
    if (googleMapUrl) return;
    getGoogleMapUrl({ placeId: googleMapPlaceId }).then((result) => {
      setGoogleMapUrl(result.googleMapsUri);
    });
  }, [googleMapPlaceId, googleMapUrl]);

  if (!googleMapUrl) {
    return null;
  }
  return (
    <Link as={NextLink} href={googleMapUrl} isExternal>
      Googleマップ
      <ExternalLinkIcon mx="2px" />
    </Link>
  );
}
