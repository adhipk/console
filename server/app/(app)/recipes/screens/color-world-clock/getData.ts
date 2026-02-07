import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

interface CityTime {
	city: string;
	country: string;
	time: string;
	date: string;
	utcOffset: string;
	isDay: boolean;
	hour: number;
	minute: number;
}

interface WorldClockData {
	cities: CityTime[];
	utcTime: string;
}

/* ── City definitions with UTC offsets and approximate sunrise/sunset ── */
interface CityDef {
	city: string;
	country: string;
	offset: number; // hours from UTC
	sunriseHour: number; // approximate local sunrise hour
	sunsetHour: number; // approximate local sunset hour
}

const DEFAULT_CITIES: CityDef[] = [
	{ city: "San Francisco", country: "USA", offset: -8, sunriseHour: 7, sunsetHour: 17 },
	{ city: "New York", country: "USA", offset: -5, sunriseHour: 7, sunsetHour: 17 },
	{ city: "London", country: "UK", offset: 0, sunriseHour: 7, sunsetHour: 17 },
	{ city: "Berlin", country: "Germany", offset: 1, sunriseHour: 7, sunsetHour: 17 },
	{ city: "Tokyo", country: "Japan", offset: 9, sunriseHour: 6, sunsetHour: 17 },
	{ city: "Sydney", country: "Australia", offset: 11, sunriseHour: 6, sunsetHour: 20 },
];

function computeCityTime(cityDef: CityDef, now: Date): CityTime {
	// Calculate local time from UTC
	const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
	const localMs = utcMs + cityDef.offset * 3600000;
	const localDate = new Date(localMs);

	const hour = localDate.getHours();
	const minute = localDate.getMinutes();
	const isDay = hour >= cityDef.sunriseHour && hour < cityDef.sunsetHour;

	const timeStr = localDate.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	const dateStr = localDate.toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});

	const offsetStr =
		cityDef.offset >= 0
			? `UTC+${cityDef.offset}`
			: `UTC${cityDef.offset}`;

	return {
		city: cityDef.city,
		country: cityDef.country,
		time: timeStr,
		date: dateStr,
		utcOffset: offsetStr,
		isDay,
		hour,
		minute,
	};
}

function fetchWorldClockData(cityNames?: string): WorldClockData {
	const now = new Date();

	// Parse custom cities if provided (comma-separated offsets not supported yet - use defaults)
	let cities = DEFAULT_CITIES;

	// If user specified city names, try to match them
	if (cityNames) {
		const CITY_DATABASE: CityDef[] = [
			{ city: "San Francisco", country: "USA", offset: -8, sunriseHour: 7, sunsetHour: 17 },
			{ city: "Los Angeles", country: "USA", offset: -8, sunriseHour: 6, sunsetHour: 18 },
			{ city: "Denver", country: "USA", offset: -7, sunriseHour: 7, sunsetHour: 17 },
			{ city: "Chicago", country: "USA", offset: -6, sunriseHour: 7, sunsetHour: 17 },
			{ city: "New York", country: "USA", offset: -5, sunriseHour: 7, sunsetHour: 17 },
			{ city: "São Paulo", country: "Brazil", offset: -3, sunriseHour: 6, sunsetHour: 19 },
			{ city: "London", country: "UK", offset: 0, sunriseHour: 7, sunsetHour: 17 },
			{ city: "Paris", country: "France", offset: 1, sunriseHour: 8, sunsetHour: 18 },
			{ city: "Berlin", country: "Germany", offset: 1, sunriseHour: 7, sunsetHour: 17 },
			{ city: "Cairo", country: "Egypt", offset: 2, sunriseHour: 6, sunsetHour: 18 },
			{ city: "Istanbul", country: "Turkey", offset: 3, sunriseHour: 7, sunsetHour: 18 },
			{ city: "Moscow", country: "Russia", offset: 3, sunriseHour: 8, sunsetHour: 17 },
			{ city: "Dubai", country: "UAE", offset: 4, sunriseHour: 6, sunsetHour: 18 },
			{ city: "Mumbai", country: "India", offset: 5.5, sunriseHour: 7, sunsetHour: 18 },
			{ city: "Delhi", country: "India", offset: 5.5, sunriseHour: 7, sunsetHour: 18 },
			{ city: "Bangkok", country: "Thailand", offset: 7, sunriseHour: 6, sunsetHour: 18 },
			{ city: "Singapore", country: "Singapore", offset: 8, sunriseHour: 7, sunsetHour: 19 },
			{ city: "Hong Kong", country: "China", offset: 8, sunriseHour: 7, sunsetHour: 18 },
			{ city: "Beijing", country: "China", offset: 8, sunriseHour: 7, sunsetHour: 18 },
			{ city: "Seoul", country: "South Korea", offset: 9, sunriseHour: 7, sunsetHour: 18 },
			{ city: "Tokyo", country: "Japan", offset: 9, sunriseHour: 6, sunsetHour: 17 },
			{ city: "Sydney", country: "Australia", offset: 11, sunriseHour: 6, sunsetHour: 20 },
			{ city: "Auckland", country: "New Zealand", offset: 13, sunriseHour: 6, sunsetHour: 20 },
			{ city: "Honolulu", country: "USA", offset: -10, sunriseHour: 7, sunsetHour: 18 },
		];

		const requestedNames = cityNames.split(",").map((n) => n.trim().toLowerCase());
		const matched = requestedNames
			.map((name) =>
				CITY_DATABASE.find(
					(c) => c.city.toLowerCase() === name || c.country.toLowerCase() === name,
				),
			)
			.filter(Boolean) as CityDef[];

		if (matched.length >= 2) {
			cities = matched.slice(0, 6);
			// Pad to 6 if needed
			while (cities.length < 6) {
				const next = DEFAULT_CITIES.find(
					(dc) => !cities.some((c) => c.city === dc.city),
				);
				if (next) cities.push(next);
				else break;
			}
		}
	}

	const cityTimes = cities.map((c) => computeCityTime(c, now));

	const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
	const utcTime = `${utcNow.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	})} UTC`;

	return {
		cities: cityTimes,
		utcTime,
	};
}

const getCachedWorldClock = unstable_cache(
	async (cityNames?: string): Promise<WorldClockData> => {
		return fetchWorldClockData(cityNames);
	},
	["color-world-clock-data"],
	{
		tags: ["color-world-clock"],
		revalidate: 300, // 5 minutes
	},
);

type WorldClockParams = {
	cities?: string;
};

export default async function getData(
	params?: WorldClockParams,
): Promise<WorldClockData> {
	try {
		return await getCachedWorldClock(params?.cities);
	} catch {
		return fetchWorldClockData(params?.cities);
	}
}
