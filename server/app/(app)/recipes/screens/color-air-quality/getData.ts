import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

interface Pollutant {
	label: string;
	value: number;
	unit: string;
	max: number;
}

interface AirQualityData {
	aqi: number;
	location: string;
	lastUpdated: string;
	pollutants: Pollutant[];
	dominantPollutant: string;
}

/* ── Geocode a location ────────────────────────────────────────────── */
async function geocodeLocation(
	locationName: string,
): Promise<{ latitude: number; longitude: number; name: string } | null> {
	try {
		const response = await fetch(
			`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`,
			{ headers: { Accept: "application/json" }, next: { revalidate: 0 } },
		);
		if (!response.ok) return null;
		const data = await response.json();
		if (data.results?.length > 0) {
			const r = data.results[0];
			return {
				latitude: r.latitude,
				longitude: r.longitude,
				name: `${r.name}, ${r.country}`,
			};
		}
		return null;
	} catch {
		return null;
	}
}

/* ── Convert European AQI to US AQI approximation ─────────────────── */
function europeanToUsAqi(euAqi: number): number {
	// European AQI and US AQI have different scales
	// This is a rough mapping: EU 0-25=Good, 25-50=Fair, 50-75=Moderate, 75-100=Poor, 100+=Very Poor
	// US: 0-50=Good, 51-100=Moderate, 101-150=Unhealthy for Sensitive, 151-200=Unhealthy, 201-300=Very Unhealthy
	if (euAqi <= 25) return Math.round((euAqi / 25) * 50);
	if (euAqi <= 50) return Math.round(50 + ((euAqi - 25) / 25) * 50);
	if (euAqi <= 75) return Math.round(100 + ((euAqi - 50) / 25) * 50);
	if (euAqi <= 100) return Math.round(150 + ((euAqi - 75) / 25) * 50);
	return Math.round(200 + ((euAqi - 100) / 100) * 100);
}

/* ── Find dominant pollutant ───────────────────────────────────────── */
function findDominant(pollutants: Pollutant[]): string {
	let maxRatio = 0;
	let dominant = "PM2.5";
	for (const p of pollutants) {
		const ratio = p.value / p.max;
		if (ratio > maxRatio) {
			maxRatio = ratio;
			dominant = p.label;
		}
	}
	return dominant;
}

/* ── Fetch air quality from Open-Meteo ─────────────────────────────── */
async function fetchAirQuality(location: string): Promise<AirQualityData> {
	const fallback: AirQualityData = {
		aqi: 0,
		location,
		lastUpdated: "N/A",
		pollutants: [
			{ label: "PM2.5", value: 0, unit: "µg/m³", max: 75 },
			{ label: "PM10", value: 0, unit: "µg/m³", max: 150 },
			{ label: "O₃", value: 0, unit: "µg/m³", max: 120 },
			{ label: "NO₂", value: 0, unit: "µg/m³", max: 100 },
			{ label: "SO₂", value: 0, unit: "µg/m³", max: 50 },
			{ label: "CO", value: 0, unit: "mg/m³", max: 10 },
		],
		dominantPollutant: "N/A",
	};

	const geo = await geocodeLocation(location);
	if (!geo) return { ...fallback, location };

	try {
		const response = await fetch(
			`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${geo.latitude}&longitude=${geo.longitude}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`,
			{ headers: { Accept: "application/json" }, next: { revalidate: 0 } },
		);

		if (!response.ok) {
			return { ...fallback, location: geo.name };
		}

		const data = await response.json();
		const current = data.current;

		if (!current) {
			return { ...fallback, location: geo.name };
		}

		const pollutants: Pollutant[] = [
			{
				label: "PM2.5",
				value: Math.round((current.pm2_5 ?? 0) * 10) / 10,
				unit: "µg/m³",
				max: 75,
			},
			{
				label: "PM10",
				value: Math.round((current.pm10 ?? 0) * 10) / 10,
				unit: "µg/m³",
				max: 150,
			},
			{
				label: "O₃",
				value: Math.round((current.ozone ?? 0) * 10) / 10,
				unit: "µg/m³",
				max: 120,
			},
			{
				label: "NO₂",
				value: Math.round((current.nitrogen_dioxide ?? 0) * 10) / 10,
				unit: "µg/m³",
				max: 100,
			},
			{
				label: "SO₂",
				value: Math.round((current.sulphur_dioxide ?? 0) * 10) / 10,
				unit: "µg/m³",
				max: 50,
			},
			{
				label: "CO",
				// Open-Meteo returns CO in µg/m³, convert to mg/m³
				value: Math.round(((current.carbon_monoxide ?? 0) / 1000) * 10) / 10,
				unit: "mg/m³",
				max: 10,
			},
		];

		const euAqi = current.european_aqi ?? 0;
		const usAqi = europeanToUsAqi(euAqi);

		const updatedTime = current.time
			? new Date(current.time).toLocaleString("en-US", {
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				})
			: "N/A";

		return {
			aqi: usAqi,
			location: geo.name,
			lastUpdated: updatedTime,
			pollutants,
			dominantPollutant: findDominant(pollutants),
		};
	} catch (error) {
		console.error("Error fetching air quality data:", error);
		return { ...fallback, location: geo.name };
	}
}

const getCachedAirQuality = unstable_cache(
	async (location: string): Promise<AirQualityData> => {
		const data = await fetchAirQuality(location);
		if (data.aqi === 0 && data.lastUpdated === "N/A") {
			throw new Error("Empty data - skip caching");
		}
		return data;
	},
	["color-air-quality-data"],
	{
		tags: ["color-air-quality"],
		revalidate: 600, // 10 minutes
	},
);

type AirQualityParams = {
	location?: string;
};

export default async function getData(
	params?: AirQualityParams,
): Promise<AirQualityData> {
	const location = params?.location || "San Francisco";
	try {
		return await getCachedAirQuality(location);
	} catch {
		return fetchAirQuality(location);
	}
}
