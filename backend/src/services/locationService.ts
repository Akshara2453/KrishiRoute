type Location = {
  lat: number;
  lng: number;
};

// 🔹 Safe normalize
const normalize = (str?: string) => (str || "").toLowerCase().trim();

// 🔹 MAIN FUNCTION (only one!)
export const resolveLocation = (
  market?: string,
  district?: string,
  state?: string
): Location => {
  
  const marketKey = normalize(market);
  const districtKey = normalize(district);
  const stateKey = normalize(state);

  // 🟢 Simple hardcoded fallback locations (add few important ones)
  const fallbackLocations: Record<string, Location> = {
    "hyderabad": { lat: 17.385, lng: 78.486 },
    "delhi": { lat: 28.66, lng: 77.23 },
    "mumbai": { lat: 18.9667, lng: 72.8333 },
    "bangalore": { lat: 12.9699, lng: 77.598 },
    "chennai": { lat: 13.0825, lng: 80.275 }
  };

  // 🔹 Try market
  if (fallbackLocations[marketKey]) {
    return fallbackLocations[marketKey];
  }

  // 🔹 Try district
  if (fallbackLocations[districtKey]) {
    return fallbackLocations[districtKey];
  }

  // 🔹 Try state
  if (fallbackLocations[stateKey]) {
    return fallbackLocations[stateKey];
  }

  // 🔹 Default (Hyderabad)
  return { lat: 17.385, lng: 78.486 };
};