"use server";

type GetDistanceMatrixArgs = {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
};

type DistanceMatrixRes = {
  rows: {
    elements: {
      distance: { text: string; value: number };
      duration: { text: string; value: number };
    }[];
  }[];
};

export const getDistanceMatrix = async ({ origin, destination }: GetDistanceMatrixArgs): Promise<DistanceMatrixRes> => {
  const originString = `${origin.latitude},${origin.longitude}`;
  const destinationString = `${destination.latitude},${destination.longitude}`;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originString}&destinations=${destinationString}&key=${process.env.GOOGLE_MAP_API_KEY}&language=ja&mode=walking`;
  const response = await fetch(url);
  const data = (await response.json()) as DistanceMatrixRes;
  return data;
};
