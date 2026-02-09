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

/* ── Analog clock face ─────────────────────────────────────────────── */
function AnalogClock({
	hour,
	minute,
	size,
	isDay,
}: {
	hour: number;
	minute: number;
	size: number;
	isDay: boolean;
}) {
	const cx = size / 2;
	const cy = size / 2;
	const r = size / 2 - 4;

	const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
	const hourRad = (hourAngle * Math.PI) / 180;
	const hourLength = r * 0.5;
	const hourX = cx + hourLength * Math.cos(hourRad);
	const hourY = cy + hourLength * Math.sin(hourRad);

	const minuteAngle = minute * 6 - 90;
	const minuteRad = (minuteAngle * Math.PI) / 180;
	const minuteLength = r * 0.7;
	const minuteX = cx + minuteLength * Math.cos(minuteRad);
	const minuteY = cy + minuteLength * Math.sin(minuteRad);

	const rimColor = isDay ? C.orange : C.blue;

	return (
		<svg
			role="img"
			aria-label="Clock"
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
		>
			<circle
				cx={cx}
				cy={cy}
				r={r}
				fill={C.white}
				stroke={rimColor}
				strokeWidth="3"
			/>
			{/* 12 hour tick marks */}
			{Array.from({ length: 12 }).map((_, i) => {
				const a = ((i * 30 - 90) * Math.PI) / 180;
				const inner = r - (i % 3 === 0 ? 8 : 5);
				const outer = r - 2;
				return (
					<line
						key={i}
						x1={cx + inner * Math.cos(a)}
						y1={cy + inner * Math.sin(a)}
						x2={cx + outer * Math.cos(a)}
						y2={cy + outer * Math.sin(a)}
						stroke={C.black}
						strokeWidth={i % 3 === 0 ? "2.5" : "1"}
						strokeLinecap="round"
					/>
				);
			})}
			{/* Hour hand */}
			<line
				x1={cx}
				y1={cy}
				x2={hourX}
				y2={hourY}
				stroke={C.black}
				strokeWidth="3.5"
				strokeLinecap="round"
			/>
			{/* Minute hand */}
			<line
				x1={cx}
				y1={cy}
				x2={minuteX}
				y2={minuteY}
				stroke={rimColor}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			{/* Center dot */}
			<circle cx={cx} cy={cy} r="3" fill={rimColor} />
		</svg>
	);
}

/* ── Day / Night icon ──────────────────────────────────────────────── */
function DayNightIcon({ isDay, size = 16 }: { isDay: boolean; size?: number }) {
	if (isDay) {
		return (
			<svg
				role="img"
				aria-label="Day"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
				fill="none"
				stroke={C.orange}
				strokeWidth="2"
				strokeLinecap="round"
			>
				<circle cx="12" cy="12" r="4" fill={C.yellow} stroke={C.orange} />
				<line x1="12" y1="2" x2="12" y2="5" />
				<line x1="12" y1="19" x2="12" y2="22" />
				<line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
				<line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
				<line x1="2" y1="12" x2="5" y2="12" />
				<line x1="19" y1="12" x2="22" y2="12" />
				<line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
				<line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
			</svg>
		);
	}
	return (
		<svg
			role="img"
			aria-label="Night"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
		>
			<path
				d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
				fill={C.blue}
				stroke={C.blue}
				strokeWidth="1.5"
			/>
		</svg>
	);
}

/* ── Prop types ─────────────────────────────────────────────────────── */
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

interface ColorWorldClockProps {
	cities?: CityTime[];
	utcTime?: string;
	width?: number;
	height?: number;
}

/* ── Dynamic defaults ──────────────────────────────────────────────── */
interface CityDef {
	city: string;
	country: string;
	offset: number;
	sunriseHour: number;
	sunsetHour: number;
}

const DEFAULT_CITY_DEFS: CityDef[] = [
	{
		city: "San Francisco",
		country: "USA",
		offset: -8,
		sunriseHour: 7,
		sunsetHour: 17,
	},
	{
		city: "New York",
		country: "USA",
		offset: -5,
		sunriseHour: 7,
		sunsetHour: 17,
	},
	{ city: "London", country: "UK", offset: 0, sunriseHour: 7, sunsetHour: 17 },
	{
		city: "Berlin",
		country: "Germany",
		offset: 1,
		sunriseHour: 7,
		sunsetHour: 17,
	},
	{
		city: "Tokyo",
		country: "Japan",
		offset: 9,
		sunriseHour: 6,
		sunsetHour: 17,
	},
	{
		city: "Sydney",
		country: "Australia",
		offset: 11,
		sunriseHour: 6,
		sunsetHour: 20,
	},
];

function computeCityTime(def: CityDef, now: Date): CityTime {
	const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
	const localMs = utcMs + def.offset * 3600000;
	const localDate = new Date(localMs);
	const hour = localDate.getHours();
	const minute = localDate.getMinutes();
	const isDay = hour >= def.sunriseHour && hour < def.sunsetHour;
	return {
		city: def.city,
		country: def.country,
		time: localDate.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		}),
		date: localDate.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		}),
		utcOffset: def.offset >= 0 ? `UTC+${def.offset}` : `UTC${def.offset}`,
		isDay,
		hour,
		minute,
	};
}

function getDefaultCities(): CityTime[] {
	const now = new Date();
	return DEFAULT_CITY_DEFS.map((def) => computeCityTime(def, now));
}

function getDefaultUtcTime(): string {
	const now = new Date();
	const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
	return `${utcNow.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} UTC`;
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function ColorWorldClock({
	cities = getDefaultCities(),
	utcTime = getDefaultUtcTime(),
	width = 800,
	height = 480,
}: ColorWorldClockProps) {
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
						backgroundColor: C.black,
						color: C.white,
					}}
				>
					<span
						style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "2px" }}
					>
						WORLD CLOCK
					</span>
					<span style={{ fontSize: "14px", fontWeight: 500, color: C.yellow }}>
						{utcTime}
					</span>
				</div>

				{/* ── Clock grid: 3 columns × 2 rows ──────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						padding: "8px 12px",
					}}
				>
					{/* Row 1 */}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							flex: 1,
						}}
					>
						{cities.slice(0, 3).map((city) => (
							<div
								key={city.city}
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									flex: 1,
									padding: "8px",
									marginRight: "8px",
									border: `1.5px solid ${city.isDay ? C.orange : C.blue}`,
									borderRadius: "8px",
								}}
							>
								<AnalogClock
									hour={city.hour}
									minute={city.minute}
									size={80}
									isDay={city.isDay}
								/>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										marginLeft: "10px",
										flex: 1,
									}}
								>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<DayNightIcon isDay={city.isDay} size={14} />
										<span
											style={{
												fontSize: "14px",
												fontWeight: 700,
												color: C.black,
												marginLeft: "6px",
											}}
										>
											{city.city}
										</span>
									</div>
									<span
										style={{
											fontSize: "10px",
											color: C.black,
											fontWeight: 400,
											marginTop: "2px",
										}}
									>
										{city.country}
									</span>
									<span
										style={{
											fontSize: "22px",
											fontWeight: 700,
											color: city.isDay ? C.orange : C.blue,
											marginTop: "4px",
											lineHeight: 1,
										}}
									>
										{city.time}
									</span>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											marginTop: "4px",
										}}
									>
										<span
											style={{
												fontSize: "10px",
												color: C.black,
												fontWeight: 400,
											}}
										>
											{city.date}
										</span>
										<span
											style={{
												fontSize: "9px",
												color: C.white,
												fontWeight: 600,
												backgroundColor: city.isDay ? C.orange : C.blue,
												padding: "1px 5px",
												borderRadius: "3px",
												marginLeft: "6px",
											}}
										>
											{city.utcOffset}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Row 2 */}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							flex: 1,
							marginTop: "8px",
						}}
					>
						{cities.slice(3, 6).map((city) => (
							<div
								key={city.city}
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									flex: 1,
									padding: "8px",
									marginRight: "8px",
									border: `1.5px solid ${city.isDay ? C.orange : C.blue}`,
									borderRadius: "8px",
								}}
							>
								<AnalogClock
									hour={city.hour}
									minute={city.minute}
									size={80}
									isDay={city.isDay}
								/>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										marginLeft: "10px",
										flex: 1,
									}}
								>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<DayNightIcon isDay={city.isDay} size={14} />
										<span
											style={{
												fontSize: "14px",
												fontWeight: 700,
												color: C.black,
												marginLeft: "6px",
											}}
										>
											{city.city}
										</span>
									</div>
									<span
										style={{
											fontSize: "10px",
											color: C.black,
											fontWeight: 400,
											marginTop: "2px",
										}}
									>
										{city.country}
									</span>
									<span
										style={{
											fontSize: "22px",
											fontWeight: 700,
											color: city.isDay ? C.orange : C.blue,
											marginTop: "4px",
											lineHeight: 1,
										}}
									>
										{city.time}
									</span>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											marginTop: "4px",
										}}
									>
										<span
											style={{
												fontSize: "10px",
												color: C.black,
												fontWeight: 400,
											}}
										>
											{city.date}
										</span>
										<span
											style={{
												fontSize: "9px",
												color: C.white,
												fontWeight: 600,
												backgroundColor: city.isDay ? C.orange : C.blue,
												padding: "1px 5px",
												borderRadius: "3px",
												marginLeft: "6px",
											}}
										>
											{city.utcOffset}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* ── Footer ───────────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						padding: "6px 20px",
						justifyContent: "center",
						fontSize: "10px",
						color: C.black,
					}}
				>
					Updated every 5 minutes · Configure cities in settings
				</div>
			</div>
		</PreSatori>
	);
}
