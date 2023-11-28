export type Restaurant = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  foodImagePath: string;
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: "ナカノシマせんべろ",
    latitude: 34.6795815090036,
    longitude: 135.4983610283611,
    foodImagePath: "/restaurants/restaurant-1.png",
  },
  {
    id: 2,
    name: "イタリアンバル イタリー",
    latitude: 34.67938711932558,
    longitude: 135.4989381822759,
    foodImagePath: "/restaurants/restaurant-2.png",
  },
  {
    id: 3,
    name: "ワインとハムのお店 よかいち",
    latitude: 34.67797768113267,
    longitude: 135.49799714714757,
    foodImagePath: "/restaurants/restaurant-3.png",
  },
  {
    id: 4,
    name: "イタリアン食堂ぐらり",
    latitude: 34.67900455806329,
    longitude: 135.4991354708327,
    foodImagePath: "/restaurants/restaurant-4.png",
  },
  {
    id: 5,
    name: "韓国ボーノ",
    latitude: 34.68001562348241,
    longitude: 135.4992328988736,
    foodImagePath: "/restaurants/restaurant-5.png",
  },
];
