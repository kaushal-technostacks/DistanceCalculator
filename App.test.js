import React from "react";
import renderer from "react-test-renderer";
import { getDistanceFromLatLonInKm } from "./src/utils/Calculations";

describe("<App />", () => {
  it("should provide valid result on proper co-ordinates", () => {
    //[lat1,lon1,lat2,lon2]
    const params = [12, 6, 12, 24];
    const result = getDistanceFromLatLonInKm(...params);
    expect(result).toBeDefined();
  });
});
