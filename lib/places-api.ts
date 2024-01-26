export type SearchPlaceResult = {
  id: string;
  displayName: {
    text: string;
  };
};

export async function searchPlaces({ text }: { text: string }) {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
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
    }
  );
  return response.json() as Promise<{
    places: SearchPlaceResult[];
  }>;
}
