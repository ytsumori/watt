"use server";

export type PlaceDetailResult = {
  id: string;
  displayName: {
    text: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  googleMapsUri: string;
};

export async function searchPlaces({ text }: { text: string }) {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_MAP_API_KEY!,
      "X-Goog-FieldMask": "places.id,places.displayName.text,places.location,places.googleMapsUri"
    },
    body: JSON.stringify({
      textQuery: text,
      languageCode: "ja",
      includedType: "restaurant"
    })
  });
  return response.json() as Promise<{
    places: PlaceDetailResult[];
  }>;
}

export async function getPlaceDetail({ placeId }: { placeId: string }) {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,location,googleMapsUri&key=${process.env.GOOGLE_MAP_API_KEY}&languageCode=ja`
  );
  return response.json() as Promise<PlaceDetailResult>;
}

type OpeningHoursResult = {
  currentOpeningHours?: {
    periods: {
      open: {
        day: number;
        hour: number;
        minute: number;
      };
      close: {
        day: number;
        hour: number;
        minute: number;
      };
    }[];
  };
};

export async function getOpeningHours({ placeId }: { placeId: string }) {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?fields=current_opening_hours.periods&key=${process.env.GOOGLE_MAP_API_KEY}&languageCode=ja`
  );
  return response.json() as Promise<OpeningHoursResult>;
}
