import { fetchMandiPrices } from "./agmarknetService";
import { getDistance } from "./distanceService";
import { Location } from "../types";
import { Mandi } from "../types";
import { VEHICLE_CAPACITY } from "../config/constants";

interface MarketOption {
  name: string;
  state: string;
  district: string;
  price: number;
  distance: number;
  transportCost: number;
  totalRevenue: number;
  netProfit: number;
}

const vehicleRates: Record<string, number> = {
  mini: 15,
  truck: 25,
  lorry: 35
};

export const getBestMarket = async (
  crop: string,
  quantity: number,
  state: string,
  district: string,
  vehicle: string,
  sourceLocation: Location,
  rideShare: boolean = false,
  otherQuantity: number = 0
) => {
  // 🔹 Fetch real mandi data
  const mandis = await fetchMandiPrices(
    crop,
    state,
    district
  );

  if (!mandis.length) {
    return {
      bestMandi: null,
      allOptions: []
    };
  }

  const ratePerKm = vehicleRates[vehicle] || 20;

  const allOptions: MarketOption[] = mandis
    .filter((m:Mandi) => m.location)
    .map((m:Mandi) => {
      const distance = getDistance(
        sourceLocation,
        m.location
      );

      let transportCost = distance * ratePerKm;

      const totalRevenue = m.price * quantity;

      const netProfit = totalRevenue - transportCost;

      const capacity = VEHICLE_CAPACITY[vehicle] || Infinity;
      const totalQuantity = quantity + otherQuantity;

      if (rideShare && totalQuantity <= capacity) {
        transportCost *= 0.6;
      }

      return {
        name: m.name,
        state: m.state,
        district: m.district,
        price: m.price,
        distance,
        transportCost,
        totalRevenue,
        netProfit
      };
    });

  if (!allOptions.length) {
    return {
      bestMandi: null,
      allOptions: []
    };
  }

  // 🔹 Find best mandi by highest net profit
  const bestMandi = allOptions.reduce((best, current) =>
    current.netProfit > best.netProfit ? current : best
  );

  return {
    bestMandi,
    allOptions
  };
};