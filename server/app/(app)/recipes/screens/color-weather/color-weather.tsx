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

/* ── Weather icon by code ──────────────────────────────────────────── */
function WeatherIcon({ code, size = 80 }: { code: number; size?: number }) {
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

/* ── Prop types ─────────────────────────────────────────────────────── */
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

interface ColorWeatherProps {
	temperature?: string;
	feelsLike?: string;
	humidity?: string;
	windSpeed?: string;
	description?: string;
	weatherCode?: number;
	location?: string;
	highTemp?: string;
	lowTemp?: string;
	pressure?: string;
	sunrise?: string;
	sunset?: string;
	forecast?: ForecastDay[];
	hourly?: HourlyForecast[];
	width?: number;
	height?: number;
}

/* ── Stat box ──────────────────────────────────────────────────────── */
function StatBox({
	label,
	value,
	color,
}: {
	label: string;
	value: string;
	color: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				padding: "8px 6px",
				border: `1.5px solid ${C.black}`,
				borderRadius: "6px",
				flex: 1,
				marginRight: "6px",
			}}
		>
			<span style={{ fontSize: "11px", color: C.black, fontWeight: 500 }}>
				{label}
			</span>
			<span
				style={{ fontSize: "16px", color, fontWeight: 700, marginTop: "2px" }}
			>
				{value}
			</span>
		</div>
	);
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function ColorWeather({
	temperature = "72",
	feelsLike = "70",
	humidity = "45",
	windSpeed = "8",
	description = "Sunny",
	weatherCode = 0,
	location = "San Francisco, US",
	highTemp = "78",
	lowTemp = "61",
	pressure = "1013",
	sunrise = "6:48 AM",
	sunset = "5:32 PM",
	forecast = [
		{
			day: "SAT",
			date: "Feb 7",
			high: "76",
			low: "59",
			code: 1,
			description: "Mainly clear",
		},
		{
			day: "SUN",
			date: "Feb 8",
			high: "71",
			low: "55",
			code: 3,
			description: "Overcast",
		},
		{
			day: "MON",
			date: "Feb 9",
			high: "68",
			low: "52",
			code: 61,
			description: "Slight rain",
		},
		{
			day: "TUE",
			date: "Feb 10",
			high: "65",
			low: "50",
			code: 63,
			description: "Moderate rain",
		},
	],
	hourly = [],
	width = 800,
	height = 480,
}: ColorWeatherProps) {
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
				{/* ── Header ───────────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "10px 20px",
						backgroundColor: C.blue,
						color: C.white,
					}}
				>
					<span style={{ fontSize: "18px", fontWeight: 700 }}>WEATHER</span>
					<span style={{ fontSize: "14px", fontWeight: 500 }}>{location}</span>
				</div>

				{/* ── Current conditions ───────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						padding: "16px 20px",
					}}
				>
					<WeatherIcon code={weatherCode} size={80} />
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							marginLeft: "16px",
							flex: 1,
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
									fontSize: "64px",
									fontWeight: 700,
									lineHeight: 1,
									color: C.black,
								}}
							>
								{temperature}°
							</span>
							<span
								style={{
									fontSize: "18px",
									fontWeight: 500,
									marginLeft: "8px",
									color: C.black,
								}}
							>
								{description}
							</span>
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								marginTop: "4px",
								fontSize: "14px",
							}}
						>
							<span style={{ color: C.red, fontWeight: 700 }}>
								H: {highTemp}°
							</span>
							<span
								style={{ color: C.blue, fontWeight: 700, marginLeft: "16px" }}
							>
								L: {lowTemp}°
							</span>
							<span style={{ color: C.black, marginLeft: "16px" }}>
								Feels like {feelsLike}°
							</span>
						</div>
					</div>
				</div>

				{/* ── Stats row ────────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						padding: "0 16px 12px 16px",
					}}
				>
					<StatBox label="Humidity" value={`${humidity}%`} color={C.blue} />
					<StatBox label="Wind" value={`${windSpeed} km/h`} color={C.black} />
					<StatBox label="Pressure" value={`${pressure} hPa`} color={C.black} />
					<StatBox label="Sunrise" value={sunrise} color={C.orange} />
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							padding: "8px 6px",
							border: `1.5px solid ${C.black}`,
							borderRadius: "6px",
							flex: 1,
						}}
					>
						<span style={{ fontSize: "11px", color: C.black, fontWeight: 500 }}>
							Sunset
						</span>
						<span
							style={{
								fontSize: "16px",
								color: C.red,
								fontWeight: 700,
								marginTop: "2px",
							}}
						>
							{sunset}
						</span>
					</div>
				</div>

				{/* ── Hourly forecast (if available) ──────────────────── */}
				{hourly.length > 0 && (
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							padding: "0 16px 12px 16px",
							justifyContent: "space-between",
						}}
					>
						{hourly.slice(0, 6).map((h, i) => (
							<div
								key={i}
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									flex: 1,
								}}
							>
								<span
									style={{ fontSize: "10px", color: C.black, fontWeight: 500 }}
								>
									{h.hour}
								</span>
								<WeatherIcon code={h.code} size={20} />
								<span
									style={{ fontSize: "13px", color: C.black, fontWeight: 700 }}
								>
									{h.temp}°
								</span>
							</div>
						))}
					</div>
				)}

				{/* ── 4-day forecast ──────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						padding: "0 16px",
					}}
				>
					<span
						style={{
							fontSize: "13px",
							fontWeight: 700,
							color: C.black,
							letterSpacing: "1px",
							marginBottom: "8px",
						}}
					>
						FORECAST
					</span>
					{forecast.map((day) => (
						<div
							key={day.day}
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								padding: "6px 0",
								borderBottom: `1px solid #E0E0E0`,
							}}
						>
							<span
								style={{
									fontSize: "14px",
									fontWeight: 700,
									color: C.black,
									width: "40px",
								}}
							>
								{day.day}
							</span>
							<span
								style={{
									fontSize: "11px",
									color: C.black,
									width: "50px",
								}}
							>
								{day.date}
							</span>
							<div
								style={{
									display: "flex",
									marginLeft: "4px",
									marginRight: "8px",
								}}
							>
								<WeatherIcon code={day.code} size={22} />
							</div>
							<span
								style={{
									fontSize: "12px",
									color: C.black,
									flex: 1,
								}}
							>
								{day.description}
							</span>
							{/* Temperature bar */}
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									width: "120px",
									justifyContent: "flex-end",
								}}
							>
								<span
									style={{
										fontSize: "14px",
										color: C.blue,
										fontWeight: 700,
										width: "32px",
										textAlign: "right",
									}}
								>
									{day.low}°
								</span>
								<div
									style={{
										display: "flex",
										width: "40px",
										height: "6px",
										borderRadius: "3px",
										marginLeft: "6px",
										marginRight: "6px",
										overflow: "hidden",
									}}
								>
									<div
										style={{
											flex: 1,
											backgroundColor: C.blue,
											borderRadius: "3px 0 0 3px",
										}}
									/>
									<div
										style={{
											flex: 1,
											backgroundColor: C.red,
											borderRadius: "0 3px 3px 0",
										}}
									/>
								</div>
								<span
									style={{
										fontSize: "14px",
										color: C.red,
										fontWeight: 700,
										width: "32px",
									}}
								>
									{day.high}°
								</span>
							</div>
						</div>
					))}
				</div>

				{/* ── Footer ───────────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						padding: "8px 20px",
						justifyContent: "center",
						fontSize: "10px",
						color: C.black,
					}}
				>
					Data from Open-Meteo · Updated every 15 min
				</div>
			</div>
		</PreSatori>
	);
}
