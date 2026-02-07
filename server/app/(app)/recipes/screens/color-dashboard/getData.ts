import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

interface WeatherData {
	temperature: string;
	feelsLike: string;
	humidity: string;
	windSpeed: string;
	description: string;
	weatherCode: number;
	location: string;
	highTemp: string;
	lowTemp: string;
	forecast: Array<{
		day: string;
		high: string;
		low: string;
		code: number;
	}>;
}

interface CalendarEvent {
	time: string;
	title: string;
	color: "red" | "green" | "blue" | "orange";
}

interface DashboardData {
	weather: WeatherData;
	events: CalendarEvent[];
	quote: { text: string; author: string };
	dateTime: { date: string; time: string; dayOfWeek: string };
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
		71: "Light snow",
		73: "Snow",
		75: "Heavy snow",
		80: "Rain showers",
		81: "Mod. showers",
		82: "Heavy showers",
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

async function fetchWeather(location: string): Promise<WeatherData> {
	const geo = await geocodeLocation(location);
	if (!geo) {
		return {
			temperature: "--",
			feelsLike: "--",
			humidity: "--",
			windSpeed: "--",
			description: "Unavailable",
			weatherCode: 0,
			location,
			highTemp: "--",
			lowTemp: "--",
			forecast: [],
		};
	}

	const response = await fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=4`,
		{ headers: { Accept: "application/json" }, next: { revalidate: 0 } },
	);

	if (!response.ok) {
		return {
			temperature: "--",
			feelsLike: "--",
			humidity: "--",
			windSpeed: "--",
			description: "Unavailable",
			weatherCode: 0,
			location: geo.name,
			highTemp: "--",
			lowTemp: "--",
			forecast: [],
		};
	}

	const data = await response.json();
	const current = data.current;
	const daily = data.daily;

	const forecast = daily.time.slice(1, 4).map((day: string, i: number) => ({
		day: getDayName(day),
		high: Math.round(daily.temperature_2m_max[i + 1]).toString(),
		low: Math.round(daily.temperature_2m_min[i + 1]).toString(),
		code: daily.weather_code[i + 1],
	}));

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
		forecast,
	};
}

async function fetchQuote(): Promise<{ text: string; author: string }> {
	const quotes = [
		{
			text: "The best time to plant a tree was 20 years ago. The second best time is now.",
			author: "Chinese Proverb",
		},
		{
			text: "Simplicity is the ultimate sophistication.",
			author: "Leonardo da Vinci",
		},
		{
			text: "The only way to do great work is to love what you do.",
			author: "Steve Jobs",
		},
		{
			text: "In the middle of difficulty lies opportunity.",
			author: "Albert Einstein",
		},
		{
			text: "What you do today can improve all your tomorrows.",
			author: "Ralph Marston",
		},
		{
			text: "It is not the mountain we conquer, but ourselves.",
			author: "Edmund Hillary",
		},
		{
			text: "The journey of a thousand miles begins with a single step.",
			author: "Lao Tzu",
		},
		{
			text: "Be yourself; everyone else is already taken.",
			author: "Oscar Wilde",
		},
		{
			text: "Act as if what you do makes a difference. It does.",
			author: "William James",
		},
		{
			text: "Everything you can imagine is real.",
			author: "Pablo Picasso",
		},
		{
			text: "Do what you can, with what you have, where you are.",
			author: "Theodore Roosevelt",
		},
		{
			text: "The mind is everything. What you think you become.",
			author: "Buddha",
		},
	];

	// Pick a daily quote based on the day of year
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = now.getTime() - start.getTime();
	const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
	return quotes[dayOfYear % quotes.length];
}

function getDateTime(): {
	date: string;
	time: string;
	dayOfWeek: string;
} {
	const now = new Date();
	return {
		date: now
			.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
			.toUpperCase(),
		time: now.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		}),
		dayOfWeek: now
			.toLocaleDateString("en-US", { weekday: "long" })
			.toUpperCase(),
	};
}

function getEventsForDay(): CalendarEvent[] {
	const dayOfWeek = new Date().getDay(); // 0=Sun, 6=Sat
	const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

	if (isWeekend) {
		return [
			{ time: "10:00 AM", title: "Brunch", color: "orange" },
			{ time: "1:00 PM", title: "Outdoor walk", color: "green" },
			{ time: "4:00 PM", title: "Read a book", color: "blue" },
		];
	}

	const weekdayEvents: CalendarEvent[][] = [
		[], // Sunday (handled above)
		[ // Monday
			{ time: "9:00 AM", title: "Team standup", color: "blue" },
			{ time: "10:00 AM", title: "Sprint planning", color: "red" },
			{ time: "1:00 PM", title: "Lunch break", color: "orange" },
			{ time: "3:00 PM", title: "Deep work block", color: "green" },
		],
		[ // Tuesday
			{ time: "9:00 AM", title: "Team standup", color: "blue" },
			{ time: "11:00 AM", title: "Design review", color: "green" },
			{ time: "1:00 PM", title: "Lunch break", color: "orange" },
			{ time: "3:30 PM", title: "Code review", color: "blue" },
		],
		[ // Wednesday
			{ time: "9:00 AM", title: "Team standup", color: "blue" },
			{ time: "10:30 AM", title: "1:1 with manager", color: "red" },
			{ time: "1:00 PM", title: "Lunch break", color: "orange" },
			{ time: "2:30 PM", title: "Project sync", color: "green" },
		],
		[ // Thursday
			{ time: "9:00 AM", title: "Team standup", color: "blue" },
			{ time: "11:00 AM", title: "Architecture review", color: "green" },
			{ time: "1:00 PM", title: "Lunch break", color: "orange" },
			{ time: "3:00 PM", title: "Demo prep", color: "red" },
		],
		[ // Friday
			{ time: "9:00 AM", title: "Team standup", color: "blue" },
			{ time: "11:00 AM", title: "Team retro", color: "green" },
			{ time: "1:00 PM", title: "Lunch break", color: "orange" },
			{ time: "3:00 PM", title: "Weekly wrap-up", color: "red" },
		],
		[], // Saturday (handled above)
	];

	return weekdayEvents[dayOfWeek];
}

const getCachedDashboardData = unstable_cache(
	async (location: string): Promise<DashboardData> => {
		const [weather, quote] = await Promise.all([
			fetchWeather(location),
			fetchQuote(),
		]);

		return {
			weather,
			events: getEventsForDay(),
			quote,
			dateTime: getDateTime(),
		};
	},
	["color-dashboard-data"],
	{
		tags: ["color-dashboard"],
		revalidate: 900,
	},
);

type DashboardParams = {
	location?: string;
};

export default async function getData(
	params?: DashboardParams,
): Promise<DashboardData> {
	const location = params?.location || "San Francisco";
	try {
		return await getCachedDashboardData(location);
	} catch {
		const [weather, quote] = await Promise.all([
			fetchWeather(location),
			fetchQuote(),
		]);
		return {
			weather,
			events: getEventsForDay(),
			quote,
			dateTime: getDateTime(),
		};
	}
}
