import { Restaurant } from "@prisma/client";

export const RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: "麺や 佑",
    latitude: 34.6795815090036,
    longitude: 135.4983610283611,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "豆腐料理 空野 南船場店",
    latitude: 34.67938711932558,
    longitude: 135.4989381822759,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "野菜巻き串 えくぼ",
    latitude: 34.67797768113267,
    longitude: 135.49799714714757,
    createdAt: new Date(),
  },
];
