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

/* ── Weather icons (inline SVG, colored for e-ink) ─────────────────── */
function WeatherIcon({ code, size = 64 }: { code: number; size?: number }) {
	// Sun-like codes
	if (code <= 1) {
		return (
			<svg
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
	// Cloudy
	if (code <= 3 || code === 45 || code === 48) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
				fill={C.black}
				stroke="none"
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
	// Rain / drizzle
	if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
				fill="none"
				stroke={C.blue}
				strokeWidth="2"
				strokeLinecap="round"
			>
				<path
					d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
					fill={C.white}
					stroke={C.black}
					strokeWidth="1.5"
				/>
				<line x1="8" y1="19" x2="8" y2="22" stroke={C.blue} />
				<line x1="12" y1="19" x2="12" y2="22" stroke={C.blue} />
				<line x1="16" y1="19" x2="16" y2="22" stroke={C.blue} />
			</svg>
		);
	}
	// Snow
	if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
				fill="none"
				stroke={C.blue}
				strokeWidth="2"
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
	// Thunderstorm
	if (code >= 95) {
		return (
			<svg
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
	// Default cloud
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill={C.white}
			stroke={C.black}
			strokeWidth="1.5"
		>
			<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
		</svg>
	);
}

function SmallWeatherIcon({
	code,
	size = 28,
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

/* ── Main Component ─────────────────────────────────────────────────── */
export default function ColorDashboard({
	weather = {
		temperature: "72",
		description: "Sunny",
		weatherCode: 0,
		location: "San Francisco, US",
		highTemp: "78",
		lowTemp: "61",
		humidity: "45",
		windSpeed: "8",
		forecast: [
			{ day: "SAT", high: "76", low: "59", code: 1 },
			{ day: "SUN", high: "71", low: "55", code: 3 },
			{ day: "MON", high: "68", low: "52", code: 61 },
		],
	},
	events = [
		{ time: "9:00 AM", title: "Team standup", color: "blue" as const },
		{ time: "11:30 AM", title: "Design review", color: "green" as const },
		{ time: "1:00 PM", title: "Lunch with Sarah", color: "orange" as const },
		{ time: "3:30 PM", title: "Sprint planning", color: "red" as const },
	],
	quote = {
		text: "The best time to plant a tree was 20 years ago. The second best time is now.",
		author: "Chinese Proverb",
	},
	dateTime = {
		date: "FEB 6, 2026",
		time: "8:42 AM",
		dayOfWeek: "FRIDAY",
	},
	width = 600,
	height = 448,
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
					flexDirection: "column",
					width: "100%",
					height: "100%",
					backgroundColor: C.white,
					fontFamily: "Inter, sans-serif",
				}}
			>
				{/* ── Header: Date + Time ──────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "12px 20px",
						backgroundColor: C.black,
						color: C.white,
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
								fontSize: "22px",
								fontWeight: 700,
								letterSpacing: "1px",
								color: C.yellow,
							}}
						>
							{dateTime.dayOfWeek}
						</span>
						<span
							style={{
								fontSize: "16px",
								marginLeft: "12px",
								color: C.white,
								fontWeight: 400,
							}}
						>
							{dateTime.date}
						</span>
					</div>
					<span
						style={{
							fontSize: "28px",
							fontWeight: 700,
							color: C.white,
						}}
					>
						{dateTime.time}
					</span>
				</div>

				{/* ── Main Content: Weather + Calendar ─────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						flex: 1,
						padding: "12px 16px",
					}}
				>
					{/* ── Left: Weather ─────────────────────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "52%",
							paddingRight: "16px",
							borderRight: `2px solid ${C.black}`,
						}}
					>
						{/* Current weather */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								marginBottom: "8px",
							}}
						>
							<WeatherIcon code={weather.weatherCode} size={56} />
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									marginLeft: "12px",
								}}
							>
								<span
									style={{
										fontSize: "48px",
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
										color: C.black,
										fontWeight: 500,
										marginTop: "2px",
									}}
								>
									{weather.description}
								</span>
							</div>
						</div>

						{/* High / Low */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								marginBottom: "8px",
								fontSize: "14px",
							}}
						>
							<span style={{ color: C.red, fontWeight: 700 }}>
								H: {weather.highTemp}°
							</span>
							<span
								style={{
									color: C.blue,
									fontWeight: 700,
									marginLeft: "16px",
								}}
							>
								L: {weather.lowTemp}°
							</span>
							<span
								style={{
									color: C.black,
									marginLeft: "16px",
									fontSize: "12px",
								}}
							>
								{weather.humidity}% hum · {weather.windSpeed} km/h
							</span>
						</div>

						{/* Location */}
						<div
							style={{
								display: "flex",
								fontSize: "12px",
								color: C.black,
								marginBottom: "12px",
								fontWeight: 500,
							}}
						>
							{weather.location}
						</div>

						{/* 3-day forecast */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								flex: 1,
							}}
						>
							{weather.forecast.map((day) => (
								<div
									key={day.day}
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										flex: 1,
										padding: "8px 4px",
										border: `1.5px solid ${C.black}`,
										borderRadius: "8px",
										marginRight: "6px",
									}}
								>
									<span
										style={{
											fontSize: "13px",
											fontWeight: 700,
											color: C.black,
											marginBottom: "4px",
										}}
									>
										{day.day}
									</span>
									<SmallWeatherIcon code={day.code} size={24} />
									<div
										style={{
											display: "flex",
											flexDirection: "row",
											marginTop: "4px",
											fontSize: "12px",
										}}
									>
										<span style={{ color: C.red, fontWeight: 600 }}>
											{day.high}°
										</span>
										<span
											style={{
												color: C.blue,
												fontWeight: 600,
												marginLeft: "4px",
											}}
										>
											{day.low}°
										</span>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* ── Right: Calendar ───────────────────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "48%",
							paddingLeft: "16px",
						}}
					>
						<span
							style={{
								fontSize: "14px",
								fontWeight: 700,
								color: C.black,
								marginBottom: "10px",
								letterSpacing: "1px",
							}}
						>
							TODAY
						</span>

						{events.map((event, i) => (
							<div
								key={i}
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									marginBottom: "10px",
								}}
							>
								{/* Color indicator bar */}
								<div
									style={{
										width: "4px",
										height: "36px",
										backgroundColor: eventColors[event.color] || C.black,
										borderRadius: "2px",
										marginRight: "10px",
										flexShrink: 0,
									}}
								/>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
									}}
								>
									<span
										style={{
											fontSize: "11px",
											color: C.black,
											fontWeight: 400,
											opacity: 0.7,
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
							</div>
						))}
					</div>
				</div>

				{/* ── Footer: Daily Quote ──────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						padding: "10px 20px",
						borderTop: `2px solid ${C.black}`,
						backgroundColor: C.white,
					}}
				>
					<div
						style={{
							width: "4px",
							height: "32px",
							backgroundColor: C.orange,
							borderRadius: "2px",
							marginRight: "12px",
							flexShrink: 0,
						}}
					/>
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
								color: C.black,
								fontWeight: 400,
								fontStyle: "italic",
								lineHeight: 1.3,
							}}
						>
							"{quote.text}"
						</span>
						<span
							style={{
								fontSize: "11px",
								color: C.black,
								fontWeight: 600,
								marginTop: "2px",
							}}
						>
							— {quote.author}
						</span>
					</div>
				</div>
			</div>
		</PreSatori>
	);
}
