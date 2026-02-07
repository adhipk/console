import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

interface ForecastDay {
	day: string;
	date: string;
	high: string;
	low: string;
	code: number;
	description: string;
}

interface HourlyForecast {
	hour: string;
	temp: string;
	code: number;
}

interface WeatherDetailData {
	temperature: string;
	feelsLike: string;
	humidity: string;
	windSpeed: string;
	description: string;
	weatherCode: number;
	location: string;
	highTemp: string;
	lowTemp: string;
	pressure: string;
	sunrise: string;
	sunset: string;
	forecast: ForecastDay[];
	hourly: HourlyForecast[];
}

function getWeatherDescription(code: number): string {
	const weatherCodes: Record<number, string> = {
		0: "Clear sky",
		1: "Mainly clear",
		2: "Partly cloudy",
		3: "Overcast",
		45: "Foggy",
		48: "Rime fog",
		51: "Light drizzle",
		53: "Drizzle",
		55: "Dense drizzle",
		61: "Slight rain",
		63: "Moderate rain",
		65: "Heavy rain",
		66: "Freezing rain",
		67: "Heavy freezing rain",
		71: "Light snow",
		73: "Snow",
		75: "Heavy snow",
		77: "Snow grains",
		80: "Rain showers",
		81: "Mod. showers",
		82: "Heavy showers",
		85: "Snow showers",
		86: "Heavy snow showers",
		95: "Thunderstorm",
		96: "T-storm w/ hail",
		99: "Severe t-storm",
	};
	return weatherCodes[code] || "Unknown";
}

function getDayName(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
}

function getDateLabel(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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

async function fetchWeatherDetail(
	location: string,
): Promise<WeatherDetailData> {
	const fallback: WeatherDetailData = {
		temperature: "--",
		feelsLike: "--",
		humidity: "--",
		windSpeed: "--",
		description: "Unavailable",
		weatherCode: 0,
		location,
		highTemp: "--",
		lowTemp: "--",
		pressure: "--",
		sunrise: "--",
		sunset: "--",
		forecast: [],
		hourly: [],
	};

	const geo = await geocodeLocation(location);
	if (!geo) return fallback;

	const response = await fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=5&forecast_hours=8`,
		{ headers: { Accept: "application/json" }, next: { revalidate: 0 } },
	);

	if (!response.ok) return { ...fallback, location: geo.name };

	const data = await response.json();
	const current = data.current;
	const daily = data.daily;
	const hourly = data.hourly;

	const forecast: ForecastDay[] = daily.time
		.slice(1, 5)
		.map((day: string, i: number) => ({
			day: getDayName(day),
			date: getDateLabel(day),
			high: Math.round(daily.temperature_2m_max[i + 1]).toString(),
			low: Math.round(daily.temperature_2m_min[i + 1]).toString(),
			code: daily.weather_code[i + 1],
			description: getWeatherDescription(daily.weather_code[i + 1]),
		}));

	const hourlyForecasts: HourlyForecast[] = [];
	if (hourly?.time) {
		for (let i = 0; i < Math.min(8, hourly.time.length); i++) {
			const hour = new Date(hourly.time[i]);
			hourlyForecasts.push({
				hour: hour.toLocaleTimeString("en-US", {
					hour: "numeric",
					hour12: true,
				}),
				temp: Math.round(hourly.temperature_2m[i]).toString(),
				code: hourly.weather_code[i],
			});
		}
	}

	const formatTime = (timeStr: string) => {
		const d = new Date(timeStr);
		return d.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	return {
		temperature: Math.round(current.temperature_2m).toString(),
		feelsLike: Math.round(current.apparent_temperature).toString(),
		humidity: Math.round(current.relative_humidity_2m).toString(),
		windSpeed: Math.round(current.wind_speed_10m).toString(),
		description: getWeatherDescription(current.weather_code),
		weatherCode: current.weather_code,
		location: geo.name,
		highTemp: Math.round(daily.temperature_2m_max[0]).toString(),
		lowTemp: Math.round(daily.temperature_2m_min[0]).toString(),
		pressure: Math.round(current.surface_pressure).toString(),
		sunrise: formatTime(daily.sunrise[0]),
		sunset: formatTime(daily.sunset[0]),
		forecast,
		hourly: hourlyForecasts,
	};
}

const getCachedWeather = unstable_cache(
	async (location: string): Promise<WeatherDetailData> => {
		const data = await fetchWeatherDetail(location);
		if (data.temperature === "--") {
			throw new Error("Empty data - skip caching");
		}
		return data;
	},
	["color-weather-data"],
	{ tags: ["color-weather"], revalidate: 900 },
);

type WeatherParams = {
	location?: string;
};

export default async function getData(
	params?: WeatherParams,
): Promise<WeatherDetailData> {
	const location = params?.location || "San Francisco";
	try {
		return await getCachedWeather(location);
	} catch {
		return fetchWeatherDetail(location);
	}
}
