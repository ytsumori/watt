import { describe, expect, test } from "vitest";
import { sortRestaurants } from ".";
import { Prisma } from "@prisma/client";

import { createRestaurantMock } from "@/test/mock/createRestaurantMock";

type Restaurants = Prisma.RestaurantGetPayload<{
  include: { meals: true; googleMapPlaceInfo: { select: { latitude: true; longitude: true } } };
}>[];

describe("sortRestaurants", () => {
  const restaurants: Restaurants = [
    {
      ...createRestaurantMock({ name: "second Restaurant" }),
      googleMapPlaceInfo: { latitude: 10, longitude: 10 },
      meals: []
    },
    {
      ...createRestaurantMock({ name: "first Restaurant" }),
      googleMapPlaceInfo: { latitude: 0, longitude: 0 },
      meals: []
    },
    {
      ...createRestaurantMock({ name: "third Restaurant" }),
      googleMapPlaceInfo: { latitude: 20, longitude: 20 },
      meals: []
    }
  ];

  test("データが近い順にsortされている", async () => {
    expect(restaurants[0].name).toBe("second Restaurant");
    expect(restaurants[1].name).toBe("first Restaurant");
    expect(restaurants[2].name).toBe("third Restaurant");
    const sortedRestaurants = await sortRestaurants({ lat: 0, lng: 0 }, restaurants);
    expect(sortedRestaurants[0].name).toBe("first Restaurant");
    expect(sortedRestaurants[1].name).toBe("second Restaurant");
    expect(sortedRestaurants[2].name).toBe("third Restaurant");
  });
});
