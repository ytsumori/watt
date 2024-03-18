"use server";

export type SearchPlaceResult = {
  id: string;
  displayName: {
    text: string;
  };
};

export async function searchPlaces({ text }: { text: string }) {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!,
      "X-Goog-FieldMask": "places.id,places.displayName.text",
    },
    body: JSON.stringify({
      textQuery: text,
      languageCode: "ja",
    }),
  });
  return response.json() as Promise<{
    places: SearchPlaceResult[];
  }>;
}

export type PlaceDetailResult = {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export async function getPlaceDetail({ placeId }: { placeId: string }) {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?fields=id,location&key=${process.env
      .NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}&languageCode=ja`
  );
  return response.json() as Promise<PlaceDetailResult>;
}

type RestaurantBusinessStatusResult = {
  currentOpeningHours?: {
    openNow: boolean;
  };
};

export async function getRestaurantBusinessStatus({ placeId }: { placeId: string }) {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?fields=current_opening_hours.open_now&key=${process.env
      .NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}&languageCode=ja`
  );
  return response.json() as Promise<RestaurantBusinessStatusResult>;
}
