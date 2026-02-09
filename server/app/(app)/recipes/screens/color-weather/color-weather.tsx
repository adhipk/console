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

/* ── Condition theme: bold color block based on weather ─────────────── */
function getConditionTheme(code: number): { bg: string; fg: string } {
	if (code <= 1) return { bg: C.orange, fg: C.white };
	if (code <= 3 || code === 45 || code === 48)
		return { bg: C.black, fg: C.white };
	if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
		return { bg: C.blue, fg: C.white };
	if ((code >= 71 && code <= 77) || code === 85 || code === 86)
		return { bg: C.blue, fg: C.white };
	if (code >= 95) return { bg: C.red, fg: C.yellow };
	return { bg: C.black, fg: C.white };
}

/* ── Large white icon for condition panel ──────────────────────────── */
function ConditionIcon({ code, size = 96 }: { code: number; size?: number }) {
	const col = C.white;
	if (code <= 1) {
		// Sun with rays
		const rays = [0, 45, 90, 135, 180, 225, 270, 315];
		return (
			<svg
				role="img"
				aria-label="Clear"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 64 64"
				width={size}
				height={size}
			>
				<circle cx="32" cy="32" r="11" fill={col} />
				{rays.map((a) => {
					const r = (a * Math.PI) / 180;
					return (
						<line
							key={a}
							x1={32 + 17 * Math.cos(r)}
							y1={32 + 17 * Math.sin(r)}
							x2={32 + 24 * Math.cos(r)}
							y2={32 + 24 * Math.sin(r)}
							stroke={col}
							strokeWidth="3"
							strokeLinecap="round"
						/>
					);
				})}
			</svg>
		);
	}
	if (code <= 3 || code === 45 || code === 48) {
		return (
			<svg
				role="img"
				aria-label="Cloudy"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 64 64"
				width={size}
				height={size}
			>
				<path
					d="M48 32h-2A14 14 0 1 0 20 42h28a8 8 0 0 0 0-10z"
					fill="none"
					stroke={col}
					strokeWidth="2.5"
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
				viewBox="0 0 64 64"
				width={size}
				height={size}
				fill="none"
			>
				<path
					d="M48 28h-2A14 14 0 1 0 20 36h28a8 8 0 0 0 0-8z"
					stroke={col}
					strokeWidth="2.5"
				/>
				<line
					x1="22"
					y1="44"
					x2="19"
					y2="52"
					stroke={col}
					strokeWidth="2.5"
					strokeLinecap="round"
				/>
				<line
					x1="32"
					y1="44"
					x2="29"
					y2="52"
					stroke={col}
					strokeWidth="2.5"
					strokeLinecap="round"
				/>
				<line
					x1="42"
					y1="44"
					x2="39"
					y2="52"
					stroke={col}
					strokeWidth="2.5"
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
				viewBox="0 0 64 64"
				width={size}
				height={size}
				fill="none"
			>
				<path
					d="M48 28h-2A14 14 0 1 0 20 36h28a8 8 0 0 0 0-8z"
					stroke={col}
					strokeWidth="2.5"
				/>
				<circle cx="22" cy="50" r="3" fill={col} />
				<circle cx="34" cy="50" r="3" fill={col} />
				<circle cx="46" cy="50" r="3" fill={col} />
			</svg>
		);
	}
	if (code >= 95) {
		return (
			<svg
				role="img"
				aria-label="Storm"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 64 64"
				width={size}
				height={size}
				fill="none"
			>
				<path
					d="M48 22h-2A14 14 0 1 0 20 32h28a8 8 0 0 0 0-10z"
					stroke={col}
					strokeWidth="2.5"
				/>
				<path
					d="M34 38l-5 10h7l-5 12"
					stroke={C.yellow}
					strokeWidth="3.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}
	return (
		<svg
			role="img"
			aria-label="Weather"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 64 64"
			width={size}
			height={size}
		>
			<path
				d="M48 32h-2A14 14 0 1 0 20 42h28a8 8 0 0 0 0-10z"
				fill="none"
				stroke={col}
				strokeWidth="2.5"
			/>
		</svg>
	);
}

/* ── Compact forecast icon ─────────────────────────────────────────── */
function ForecastIcon({ code, size = 26 }: { code: number; size?: number }) {
	if (code <= 1) {
		return (
			<svg
				role="img"
				aria-label="Clear"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
				fill="none"
			>
				<circle
					cx="12"
					cy="12"
					r="4"
					fill={C.yellow}
					stroke={C.orange}
					strokeWidth="1.5"
				/>
				<line
					x1="12"
					y1="2"
					x2="12"
					y2="5"
					stroke={C.orange}
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
				<line
					x1="12"
					y1="19"
					x2="12"
					y2="22"
					stroke={C.orange}
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
				<line
					x1="2"
					y1="12"
					x2="5"
					y2="12"
					stroke={C.orange}
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
				<line
					x1="19"
					y1="12"
					x2="22"
					y2="12"
					stroke={C.orange}
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
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
					x1="9"
					y1="19"
					x2="9"
					y2="22"
					stroke={C.blue}
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<line
					x1="15"
					y1="19"
					x2="15"
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
				<circle cx="9" cy="22" r="1.5" fill={C.blue} />
				<circle cx="15" cy="22" r="1.5" fill={C.blue} />
			</svg>
		);
	}
	if (code >= 95) {
		return (
			<svg
				role="img"
				aria-label="Storm"
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

/* ── Sunrise/Sunset SVG icons ──────────────────────────────────────── */
function SunriseIcon({ size = 16 }: { size?: number }) {
	return (
		<svg
			role="img"
			aria-label="Sunrise"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
			stroke={C.orange}
			strokeWidth="2"
			strokeLinecap="round"
		>
			<path d="M17 18a5 5 0 1 0-10 0" />
			<line x1="12" y1="9" x2="12" y2="2" />
			<line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
			<line x1="1" y1="18" x2="3" y2="18" />
			<line x1="21" y1="18" x2="23" y2="18" />
			<line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
			<line x1="23" y1="22" x2="1" y2="22" />
			<path d="M16 5l-4 4-4-4" stroke={C.orange} />
		</svg>
	);
}

function SunsetIcon({ size = 16 }: { size?: number }) {
	return (
		<svg
			role="img"
			aria-label="Sunset"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
			stroke={C.red}
			strokeWidth="2"
			strokeLinecap="round"
		>
			<path d="M17 18a5 5 0 1 0-10 0" />
			<line x1="12" y1="2" x2="12" y2="9" />
			<line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
			<line x1="1" y1="18" x2="3" y2="18" />
			<line x1="21" y1="18" x2="23" y2="18" />
			<line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
			<line x1="23" y1="22" x2="1" y2="22" />
			<path d="M8 5l4 4 4-4" stroke={C.red} />
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

/* ── Dynamic defaults ──────────────────────────────────────────────── */
function getDefaultForecast(): ForecastDay[] {
	const now = new Date();
	return [1, 2, 3, 4].map((offset) => {
		const d = new Date(now);
		d.setDate(d.getDate() + offset);
		return {
			day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
			date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
			high: "--",
			low: "--",
			code: 0,
			description: "Loading...",
		};
	});
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function ColorWeather({
	temperature = "--",
	feelsLike = "--",
	humidity = "--",
	windSpeed = "--",
	description = "Loading...",
	weatherCode = 0,
	location = "San Francisco, US",
	highTemp = "--",
	lowTemp = "--",
	pressure = "--",
	sunrise = "--",
	sunset = "--",
	forecast = getDefaultForecast(),
	hourly = [],
	width = 800,
	height = 480,
}: ColorWeatherProps) {
	const theme = getConditionTheme(weatherCode);

	// Color for forecast card top edge based on weather code
	function getForecastAccent(code: number): string {
		if (code <= 1) return C.orange;
		if (code <= 3 || code === 45 || code === 48) return C.black;
		if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return C.blue;
		if ((code >= 71 && code <= 77) || code === 85 || code === 86) return C.blue;
		if (code >= 95) return C.red;
		return C.black;
	}

	return (
		<PreSatori width={width} height={height}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					backgroundColor: C.white,
				}}
			>
				{/* ── Accent bar ───────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						height: "6px",
						backgroundColor: theme.bg,
						width: "100%",
					}}
				/>

				{/* ── Main split: Condition panel + Data ───────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						flex: 1,
					}}
				>
					{/* ── LEFT: Bold condition panel ───────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "240px",
							backgroundColor: theme.bg,
							padding: "28px 24px",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<ConditionIcon code={weatherCode} size={100} />

						<span
							style={{
								fontSize: "15px",
								fontWeight: 700,
								color: theme.fg,
								marginTop: "20px",
								letterSpacing: "3px",
								textAlign: "center",
							}}
						>
							{description.length > 14
								? description.toUpperCase().slice(0, 14)
								: description.toUpperCase()}
						</span>

						{/* Hourly strip inside panel if available */}
						{hourly.length > 0 && (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									marginTop: "20px",
									width: "100%",
									alignItems: "center",
								}}
							>
								<div
									style={{
										display: "flex",
										width: "60px",
										height: "1px",
										backgroundColor: theme.fg,
										opacity: 0.4,
										marginBottom: "10px",
									}}
								/>
								{hourly.slice(0, 4).map((h, i) => (
									<div
										key={i}
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
											width: "100%",
											padding: "2px 8px",
										}}
									>
										<span
											style={{
												fontSize: "10px",
												color: theme.fg,
												fontWeight: 400,
												opacity: 0.8,
											}}
										>
											{h.hour}
										</span>
										<span
											style={{
												fontSize: "12px",
												color: theme.fg,
												fontWeight: 700,
											}}
										>
											{h.temp}°
										</span>
									</div>
								))}
							</div>
						)}

						<span
							style={{
								fontSize: "9px",
								color: theme.fg,
								marginTop: "auto",
								opacity: 0.6,
								letterSpacing: "0.5px",
							}}
						>
							OPEN-METEO
						</span>
					</div>

					{/* ── RIGHT: Data area ─────────────────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
							padding: "24px 28px 16px 28px",
						}}
					>
						{/* Location */}
						<span
							style={{
								fontSize: "12px",
								fontWeight: 600,
								color: C.black,
								letterSpacing: "2px",
							}}
						>
							{location.toUpperCase()}
						</span>

						{/* Temperature hero */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "baseline",
								marginTop: "4px",
							}}
						>
							<span
								style={{
									fontSize: "92px",
									fontWeight: 700,
									lineHeight: 1,
									color: C.black,
									letterSpacing: "-4px",
								}}
							>
								{temperature}
							</span>
							<span
								style={{
									fontSize: "40px",
									fontWeight: 300,
									color: C.black,
									marginLeft: "2px",
									lineHeight: 1,
								}}
							>
								°
							</span>
						</div>

						{/* High / Low / Feels */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								marginTop: "6px",
							}}
						>
							<span style={{ fontSize: "16px", fontWeight: 700, color: C.red }}>
								{highTemp}°
							</span>
							<div
								style={{
									display: "flex",
									width: "12px",
									height: "2px",
									backgroundColor: C.black,
									marginLeft: "6px",
									marginRight: "6px",
								}}
							/>
							<span
								style={{ fontSize: "16px", fontWeight: 700, color: C.blue }}
							>
								{lowTemp}°
							</span>
							<span
								style={{
									fontSize: "12px",
									color: C.black,
									marginLeft: "20px",
									fontWeight: 400,
								}}
							>
								Feels {feelsLike}°
							</span>
						</div>

						{/* Stats: bold numbers with tiny labels */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								marginTop: "20px",
							}}
						>
							{[
								{ label: "HUMIDITY", value: `${humidity}%`, color: C.blue },
								{
									label: "WIND",
									value: `${windSpeed}`,
									unit: "km/h",
									color: C.black,
								},
								{
									label: "PRESSURE",
									value: pressure,
									unit: "hPa",
									color: C.black,
								},
							].map((stat) => (
								<div
									key={stat.label}
									style={{
										display: "flex",
										flexDirection: "column",
										marginRight: "28px",
									}}
								>
									<span
										style={{
											fontSize: "9px",
											fontWeight: 700,
											color: C.black,
											letterSpacing: "1.5px",
											opacity: 0.4,
										}}
									>
										{stat.label}
									</span>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "baseline",
											marginTop: "2px",
										}}
									>
										<span
											style={{
												fontSize: "20px",
												fontWeight: 700,
												color: stat.color,
											}}
										>
											{stat.value}
										</span>
										{"unit" in stat && (
											<span
												style={{
													fontSize: "10px",
													color: C.black,
													marginLeft: "3px",
													fontWeight: 400,
												}}
											>
												{stat.unit}
											</span>
										)}
									</div>
								</div>
							))}
						</div>

						{/* Sunrise / Sunset with connecting line */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								marginTop: "auto",
								paddingTop: "12px",
							}}
						>
							<SunriseIcon size={18} />
							<span
								style={{
									fontSize: "13px",
									fontWeight: 700,
									color: C.orange,
									marginLeft: "6px",
								}}
							>
								{sunrise}
							</span>
							<div
								style={{
									display: "flex",
									flex: 1,
									height: "2px",
									marginLeft: "14px",
									marginRight: "14px",
									overflow: "hidden",
								}}
							>
								{/* Daylight bar: orange to red */}
								<div style={{ flex: 1, backgroundColor: C.orange }} />
								<div style={{ flex: 1, backgroundColor: C.yellow }} />
								<div style={{ flex: 1, backgroundColor: C.red }} />
							</div>
							<span
								style={{
									fontSize: "13px",
									fontWeight: 700,
									color: C.red,
									marginRight: "6px",
								}}
							>
								{sunset}
							</span>
							<SunsetIcon size={18} />
						</div>
					</div>
				</div>

				{/* ── Forecast strip ───────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						borderTop: `2.5px solid ${C.black}`,
					}}
				>
					{forecast.map((day, i) => (
						<div
							key={day.day}
							style={{
								display: "flex",
								flexDirection: "column",
								flex: 1,
								borderRight:
									i < forecast.length - 1 ? `1px solid #D0D0D0` : "none",
							}}
						>
							{/* Colored top edge */}
							<div
								style={{
									display: "flex",
									height: "4px",
									backgroundColor: getForecastAccent(day.code),
								}}
							/>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									padding: "8px 0 10px 0",
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<span
										style={{
											fontSize: "13px",
											fontWeight: 700,
											color: C.black,
											letterSpacing: "1px",
										}}
									>
										{day.day}
									</span>
									<span
										style={{
											fontSize: "10px",
											color: C.black,
											marginLeft: "6px",
											fontWeight: 400,
											opacity: 0.5,
										}}
									>
										{day.date}
									</span>
								</div>
								<div style={{ display: "flex", marginTop: "4px" }}>
									<ForecastIcon code={day.code} size={26} />
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										marginTop: "4px",
										alignItems: "center",
									}}
								>
									<span
										style={{
											fontSize: "14px",
											fontWeight: 700,
											color: C.red,
										}}
									>
										{day.high}°
									</span>
									<span
										style={{
											fontSize: "10px",
											color: C.black,
											marginLeft: "4px",
											marginRight: "4px",
											opacity: 0.3,
										}}
									>
										/
									</span>
									<span
										style={{
											fontSize: "14px",
											fontWeight: 700,
											color: C.blue,
										}}
									>
										{day.low}°
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</PreSatori>
	);
}
