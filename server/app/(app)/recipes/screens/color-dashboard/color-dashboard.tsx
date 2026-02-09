import { PreSatori } from "@/utils/pre-satori";

/* ── 7-color e-ink palette ─────────────────────────────────────────── */
const C = {
	black: "#000000",
	white: "#FFFFFF",
	red: "#E02020",
	green: "#00A000",
	blue: "#0040FF",
	yellow: "#FFE000",
	orange: "#FF8000",
} as const;

/* ── Weather icon ──────────────────────────────────────────────────── */
function WeatherIcon({ code, size = 48 }: { code: number; size?: number }) {
	if (code <= 1) {
		return (
			<svg
				role="img"
				aria-label="Sunny"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
				fill="none"
				stroke={C.orange}
				strokeWidth="2"
				strokeLinecap="round"
			>
				<circle cx="12" cy="12" r="5" fill={C.yellow} stroke={C.orange} />
				<line x1="12" y1="1" x2="12" y2="3" />
				<line x1="12" y1="21" x2="12" y2="23" />
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
				<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
				<line x1="1" y1="12" x2="3" y2="12" />
				<line x1="21" y1="12" x2="23" y2="12" />
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
				<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
			</svg>
		);
	}
	if (code <= 3 || code === 45 || code === 48) {
		return (
			<svg
				role="img"
				aria-label="Cloudy"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
			>
				<path
					d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
					fill={C.white}
					stroke={C.black}
					strokeWidth="1.5"
				/>
			</svg>
		);
	}
	if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
		return (
			<svg
				role="img"
				aria-label="Rain"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
				fill="none"
			>
				<path
					d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
					fill={C.white}
					stroke={C.black}
					strokeWidth="1.5"
				/>
				<line
					x1="8"
					y1="19"
					x2="8"
					y2="22"
					stroke={C.blue}
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<line
					x1="12"
					y1="19"
					x2="12"
					y2="22"
					stroke={C.blue}
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<line
					x1="16"
					y1="19"
					x2="16"
					y2="22"
					stroke={C.blue}
					strokeWidth="2"
					strokeLinecap="round"
				/>
			</svg>
		);
	}
	if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
		return (
			<svg
				role="img"
				aria-label="Snow"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
				fill="none"
			>
				<path
					d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
					fill={C.white}
					stroke={C.black}
					strokeWidth="1.5"
				/>
				<circle cx="9" cy="21" r="1" fill={C.blue} />
				<circle cx="13" cy="21" r="1" fill={C.blue} />
				<circle cx="17" cy="21" r="1" fill={C.blue} />
			</svg>
		);
	}
	if (code >= 95) {
		return (
			<svg
				role="img"
				aria-label="Thunderstorm"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
				fill="none"
			>
				<path
					d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
					fill={C.white}
					stroke={C.black}
					strokeWidth="1.5"
				/>
				<path d="M13 16l-2 4h3l-2 4" stroke={C.yellow} strokeWidth="2" />
			</svg>
		);
	}
	return (
		<svg
			role="img"
			aria-label="Cloud"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
		>
			<path
				d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
				fill={C.white}
				stroke={C.black}
				strokeWidth="1.5"
			/>
		</svg>
	);
}

function SmallWeatherIcon({
	code,
	size = 22,
}: {
	code: number;
	size?: number;
}) {
	return <WeatherIcon code={code} size={size} />;
}

/* ── Prop types ─────────────────────────────────────────────────────── */
interface ForecastDay {
	day: string;
	high: string;
	low: string;
	code: number;
}

interface WeatherData {
	temperature: string;
	description: string;
	weatherCode: number;
	location: string;
	highTemp: string;
	lowTemp: string;
	humidity: string;
	windSpeed: string;
	forecast: ForecastDay[];
}

interface CalendarEvent {
	time: string;
	title: string;
	color: "red" | "green" | "blue" | "orange";
}

interface DashboardProps {
	weather?: WeatherData;
	events?: CalendarEvent[];
	quote?: { text: string; author: string };
	dateTime?: { date: string; time: string; dayOfWeek: string };
	width?: number;
	height?: number;
}

/* ── Dynamic defaults ──────────────────────────────────────────────── */
function getDefaultDateTime() {
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

function getDefaultForecast(): Array<{
	day: string;
	high: string;
	low: string;
	code: number;
}> {
	const now = new Date();
	return [1, 2, 3].map((offset) => {
		const d = new Date(now);
		d.setDate(d.getDate() + offset);
		return {
			day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
			high: "--",
			low: "--",
			code: 0,
		};
	});
}

function getDefaultEvents(): CalendarEvent[] {
	const day = new Date().getDay();
	if (day === 0 || day === 6) {
		return [
			{ time: "10:00 AM", title: "Brunch", color: "orange" },
			{ time: "1:00 PM", title: "Outdoor walk", color: "green" },
			{ time: "4:00 PM", title: "Read a book", color: "blue" },
		];
	}
	return [
		{ time: "9:00 AM", title: "Team standup", color: "blue" },
		{ time: "11:30 AM", title: "Design review", color: "green" },
		{ time: "1:00 PM", title: "Lunch break", color: "orange" },
		{ time: "3:30 PM", title: "Sprint planning", color: "red" },
	];
}

const DEFAULT_QUOTES = [
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
		text: "The journey of a thousand miles begins with a single step.",
		author: "Lao Tzu",
	},
	{
		text: "Be yourself; everyone else is already taken.",
		author: "Oscar Wilde",
	},
];

function getDefaultQuote() {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const dayOfYear = Math.floor(
		(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
	);
	return DEFAULT_QUOTES[dayOfYear % DEFAULT_QUOTES.length];
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function ColorDashboard({
	weather = {
		temperature: "--",
		description: "Loading...",
		weatherCode: 0,
		location: "San Francisco, US",
		highTemp: "--",
		lowTemp: "--",
		humidity: "--",
		windSpeed: "--",
		forecast: getDefaultForecast(),
	},
	events = getDefaultEvents(),
	quote = getDefaultQuote(),
	dateTime = getDefaultDateTime(),
	width = 800,
	height = 480,
}: DashboardProps) {
	const eventColors: Record<string, string> = {
		red: C.red,
		green: C.green,
		blue: C.blue,
		orange: C.orange,
	};

	return (
		<PreSatori width={width} height={height}>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					width: "100%",
					height: "100%",
					backgroundColor: C.white,
				}}
			>
				{/* ══════════════════════════════════════════════════════
				    LEFT: Time sidebar — the dramatic anchor
				    ══════════════════════════════════════════════════════ */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						width: "220px",
						backgroundColor: C.black,
						padding: "28px 20px",
						justifyContent: "space-between",
					}}
				>
					{/* Day of week */}
					<div style={{ display: "flex", flexDirection: "column" }}>
						<span
							style={{
								fontSize: "20px",
								fontWeight: 700,
								color: C.yellow,
								letterSpacing: "4px",
							}}
						>
							{dateTime.dayOfWeek}
						</span>
						<span
							style={{
								fontSize: "13px",
								fontWeight: 400,
								color: C.white,
								marginTop: "4px",
								letterSpacing: "1px",
							}}
						>
							{dateTime.date}
						</span>
					</div>

					{/* Large time display */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
						}}
					>
						<span
							style={{
								fontSize: "56px",
								fontWeight: 700,
								color: C.white,
								lineHeight: 1,
								letterSpacing: "-2px",
							}}
						>
							{dateTime.time.replace(/ AM| PM/i, "")}
						</span>
						<span
							style={{
								fontSize: "18px",
								fontWeight: 400,
								color: C.white,
								opacity: 0.7,
								marginTop: "4px",
							}}
						>
							{dateTime.time.includes("AM") ? "AM" : "PM"}
						</span>
					</div>

					{/* Event count badge */}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<div
							style={{
								display: "flex",
								width: "28px",
								height: "28px",
								backgroundColor: C.green,
								borderRadius: "14px",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<span
								style={{
									fontSize: "14px",
									fontWeight: 700,
									color: C.white,
								}}
							>
								{events.length}
							</span>
						</div>
						<span
							style={{
								fontSize: "11px",
								color: C.white,
								marginLeft: "8px",
								fontWeight: 400,
								opacity: 0.6,
							}}
						>
							events today
						</span>
					</div>
				</div>

				{/* ══════════════════════════════════════════════════════
				    RIGHT: Content area
				    ══════════════════════════════════════════════════════ */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
					}}
				>
					{/* ── Weather block ────────────────────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							padding: "16px 20px",
							borderBottom: `2px solid ${C.black}`,
							alignItems: "center",
						}}
					>
						{/* Icon + temp */}
						<WeatherIcon code={weather.weatherCode} size={52} />
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								marginLeft: "12px",
							}}
						>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "baseline",
								}}
							>
								<span
									style={{
										fontSize: "42px",
										fontWeight: 700,
										lineHeight: 1,
										color: C.black,
									}}
								>
									{weather.temperature}°
								</span>
								<span
									style={{
										fontSize: "14px",
										fontWeight: 500,
										color: C.black,
										marginLeft: "8px",
									}}
								>
									{weather.description}
								</span>
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									marginTop: "2px",
								}}
							>
								<span
									style={{ fontSize: "13px", fontWeight: 700, color: C.red }}
								>
									{weather.highTemp}°
								</span>
								<span
									style={{
										fontSize: "13px",
										fontWeight: 700,
										color: C.blue,
										marginLeft: "10px",
									}}
								>
									{weather.lowTemp}°
								</span>
								<span
									style={{
										fontSize: "11px",
										color: C.black,
										marginLeft: "14px",
										opacity: 0.5,
									}}
								>
									{weather.humidity}% hum
								</span>
								<span
									style={{
										fontSize: "11px",
										color: C.black,
										marginLeft: "10px",
										opacity: 0.5,
									}}
								>
									{weather.windSpeed} km/h
								</span>
							</div>
						</div>

						{/* Location */}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								marginLeft: "auto",
								alignItems: "flex-end",
							}}
						>
							<span
								style={{
									fontSize: "11px",
									fontWeight: 600,
									color: C.black,
									letterSpacing: "1px",
								}}
							>
								{weather.location}
							</span>
						</div>
					</div>

					{/* ── Forecast strip ───────────────────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							borderBottom: `2px solid ${C.black}`,
						}}
					>
						{weather.forecast.map((day, i) => (
							<div
								key={day.day}
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									flex: 1,
									padding: "8px 12px",
									borderRight:
										i < weather.forecast.length - 1
											? `1px solid #D0D0D0`
											: "none",
								}}
							>
								<span
									style={{
										fontSize: "12px",
										fontWeight: 700,
										color: C.black,
										width: "32px",
									}}
								>
									{day.day}
								</span>
								<SmallWeatherIcon code={day.code} size={20} />
								<span
									style={{
										fontSize: "12px",
										fontWeight: 700,
										color: C.red,
										marginLeft: "6px",
									}}
								>
									{day.high}°
								</span>
								<span
									style={{
										fontSize: "12px",
										fontWeight: 700,
										color: C.blue,
										marginLeft: "4px",
									}}
								>
									{day.low}°
								</span>
							</div>
						))}
					</div>

					{/* ── Events ───────────────────────────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
							padding: "14px 20px",
						}}
					>
						<span
							style={{
								fontSize: "11px",
								fontWeight: 700,
								color: C.black,
								letterSpacing: "2px",
								opacity: 0.4,
								marginBottom: "10px",
							}}
						>
							AGENDA
						</span>

						<div
							style={{
								display: "flex",
								flexDirection: "column",
								flex: 1,
								justifyContent: "space-between",
							}}
						>
							{events.map((event, i) => (
								<div
									key={i}
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									{/* Thick color bar */}
									<div
										style={{
											width: "5px",
											height: "34px",
											backgroundColor: eventColors[event.color] || C.black,
											borderRadius: "2px",
											marginRight: "12px",
											flexShrink: 0,
										}}
									/>
									<span
										style={{
											fontSize: "12px",
											color: C.black,
											fontWeight: 400,
											width: "68px",
											opacity: 0.5,
											flexShrink: 0,
										}}
									>
										{event.time}
									</span>
									<span
										style={{
											fontSize: "15px",
											color: C.black,
											fontWeight: 600,
										}}
									>
										{event.title}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* ── Quote block with bold colored background ──────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							padding: "12px 20px",
							backgroundColor: C.orange,
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								flex: 1,
							}}
						>
							<span
								style={{
									fontSize: "12px",
									color: C.white,
									fontWeight: 500,
									fontStyle: "italic",
									lineHeight: 1.4,
								}}
							>
								&ldquo;{quote.text}&rdquo;
							</span>
							<span
								style={{
									fontSize: "11px",
									color: C.white,
									fontWeight: 700,
									marginTop: "4px",
								}}
							>
								— {quote.author}
							</span>
						</div>
					</div>
				</div>
			</div>
		</PreSatori>
	);
}
