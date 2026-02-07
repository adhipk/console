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

/* ── AQI helpers ───────────────────────────────────────────────────── */
interface AQILevel {
	label: string;
	color: string;
	textColor: string;
	advice: string;
}

function getAQILevel(aqi: number): AQILevel {
	if (aqi <= 50)
		return {
			label: "Good",
			color: C.green,
			textColor: C.white,
			advice: "Air quality is satisfactory. Enjoy outdoor activities!",
		};
	if (aqi <= 100)
		return {
			label: "Moderate",
			color: C.yellow,
			textColor: C.black,
			advice: "Acceptable quality. Sensitive individuals should limit prolonged outdoor exertion.",
		};
	if (aqi <= 150)
		return {
			label: "Unhealthy for Sensitive",
			color: C.orange,
			textColor: C.white,
			advice: "Sensitive groups may experience health effects. Consider reducing outdoor activity.",
		};
	if (aqi <= 200)
		return {
			label: "Unhealthy",
			color: C.red,
			textColor: C.white,
			advice: "Everyone may begin to experience health effects. Limit outdoor exertion.",
		};
	return {
		label: "Very Unhealthy",
		color: C.red,
		textColor: C.white,
		advice: "Health alert! Everyone should avoid outdoor activities.",
	};
}

/* ── Gauge arc ─────────────────────────────────────────────────────── */
function AQIGauge({ aqi, size = 160 }: { aqi: number; size?: number }) {
	const cx = size / 2;
	const cy = size / 2 + 10;
	const r = size / 2 - 12;
	const startAngle = 180; // left
	const endAngle = 360; // right
	const range = endAngle - startAngle;

	// Clamp AQI to 0-300 for the gauge
	const clampedAqi = Math.min(Math.max(aqi, 0), 300);
	const ratio = clampedAqi / 300;
	const needleAngle = startAngle + range * ratio;
	const needleRad = (needleAngle * Math.PI) / 180;
	const needleLength = r - 8;
	const needleX = cx + needleLength * Math.cos(needleRad);
	const needleY = cy + needleLength * Math.sin(needleRad);

	// Arc segments for AQI zones
	const zones = [
		{ start: 0, end: 50 / 300, color: C.green },
		{ start: 50 / 300, end: 100 / 300, color: C.yellow },
		{ start: 100 / 300, end: 150 / 300, color: C.orange },
		{ start: 150 / 300, end: 300 / 300, color: C.red },
	];

	function arcPath(startRatio: number, endRatio: number): string {
		const a1 = ((startAngle + range * startRatio) * Math.PI) / 180;
		const a2 = ((startAngle + range * endRatio) * Math.PI) / 180;
		const x1 = cx + r * Math.cos(a1);
		const y1 = cy + r * Math.sin(a1);
		const x2 = cx + r * Math.cos(a2);
		const y2 = cy + r * Math.sin(a2);
		const largeArc = endRatio - startRatio > 0.5 ? 1 : 0;
		return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
	}

	return (
		<svg
			role="img"
			aria-label={`AQI ${aqi}`}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size / 2 + 24}
			viewBox={`0 0 ${size} ${size / 2 + 24}`}
		>
			{/* Zone arcs */}
			{zones.map((zone, i) => (
				<path
					key={i}
					d={arcPath(zone.start, zone.end)}
					fill="none"
					stroke={zone.color}
					strokeWidth="10"
					strokeLinecap="butt"
				/>
			))}
			{/* Needle */}
			<line
				x1={cx}
				y1={cy}
				x2={needleX}
				y2={needleY}
				stroke={C.black}
				strokeWidth="3"
				strokeLinecap="round"
			/>
			<circle cx={cx} cy={cy} r="5" fill={C.black} />
			{/* Labels */}
			<text
				x={12}
				y={cy + 16}
				fontSize="9"
				fill={C.black}
				fontFamily="Inter, sans-serif"
			>
				0
			</text>
			<text
				x={size - 22}
				y={cy + 16}
				fontSize="9"
				fill={C.black}
				fontFamily="Inter, sans-serif"
			>
				300
			</text>
		</svg>
	);
}

/* ── Pollutant bar ─────────────────────────────────────────────────── */
function PollutantBar({
	label,
	value,
	unit,
	max,
	color,
}: {
	label: string;
	value: number;
	unit: string;
	max: number;
	color: string;
}) {
	const ratio = Math.min(value / max, 1);
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				flex: 1,
				padding: "4px 6px",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "baseline",
					marginBottom: "3px",
				}}
			>
				<span style={{ fontSize: "11px", fontWeight: 700, color: C.black }}>
					{label}
				</span>
				<span style={{ fontSize: "10px", fontWeight: 500, color: C.black }}>
					{value} {unit}
				</span>
			</div>
			<div
				style={{
					display: "flex",
					width: "100%",
					height: "8px",
					backgroundColor: "#EEEEEE",
					borderRadius: "4px",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						width: `${ratio * 100}%`,
						height: "100%",
						backgroundColor: color,
						borderRadius: "4px",
					}}
				/>
			</div>
		</div>
	);
}

/* ── Prop types ─────────────────────────────────────────────────────── */
interface Pollutant {
	label: string;
	value: number;
	unit: string;
	max: number;
}

interface ColorAirQualityProps {
	aqi?: number;
	location?: string;
	lastUpdated?: string;
	pollutants?: Pollutant[];
	dominantPollutant?: string;
	width?: number;
	height?: number;
}

/* ── Dynamic defaults ──────────────────────────────────────────────── */
function getDefaultLastUpdated() {
	return new Date().toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

function getDefaultPollutants(): Pollutant[] {
	return [
		{ label: "PM2.5", value: 0, unit: "µg/m³", max: 75 },
		{ label: "PM10", value: 0, unit: "µg/m³", max: 150 },
		{ label: "O₃", value: 0, unit: "µg/m³", max: 120 },
		{ label: "NO₂", value: 0, unit: "µg/m³", max: 100 },
		{ label: "SO₂", value: 0, unit: "µg/m³", max: 50 },
		{ label: "CO", value: 0, unit: "mg/m³", max: 10 },
	];
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function ColorAirQuality({
	aqi = 0,
	location = "San Francisco, US",
	lastUpdated = getDefaultLastUpdated(),
	pollutants = getDefaultPollutants(),
	dominantPollutant = "N/A",
	width = 800,
	height = 480,
}: ColorAirQualityProps) {
	const level = getAQILevel(aqi);

	// Assign colors to pollutant bars based on their ratio to max
	function getPollutantColor(value: number, max: number): string {
		const ratio = value / max;
		if (ratio < 0.33) return C.green;
		if (ratio < 0.66) return C.yellow;
		if (ratio < 0.85) return C.orange;
		return C.red;
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
						backgroundColor: level.color,
						color: level.textColor,
					}}
				>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "1px" }}>
							AIR QUALITY INDEX
						</span>
						<span style={{ fontSize: "12px", fontWeight: 400 }}>
							{location}
						</span>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
						}}
					>
						<span style={{ fontSize: "14px", fontWeight: 700 }}>
							{level.label}
						</span>
					</div>
				</div>

				{/* ── Main: Gauge + Info ───────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						padding: "12px 20px",
						flex: 1,
					}}
				>
					{/* Left: AQI gauge and big number */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							width: "45%",
							justifyContent: "flex-start",
						}}
					>
						<AQIGauge aqi={aqi} size={180} />
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								marginTop: "-8px",
							}}
						>
							<span
								style={{
									fontSize: "56px",
									fontWeight: 700,
									color: level.color,
									lineHeight: 1,
								}}
							>
								{aqi}
							</span>
							<span
								style={{
									fontSize: "14px",
									fontWeight: 600,
									color: C.black,
									marginTop: "4px",
								}}
							>
								US AQI
							</span>
						</div>

						{/* Dominant pollutant */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								marginTop: "12px",
								padding: "4px 12px",
								border: `1.5px solid ${C.black}`,
								borderRadius: "6px",
							}}
						>
							<span
								style={{ fontSize: "11px", fontWeight: 500, color: C.black }}
							>
								Primary: {dominantPollutant}
							</span>
						</div>
					</div>

					{/* Right: Pollutant levels */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "55%",
							paddingLeft: "16px",
							borderLeft: `2px solid ${C.black}`,
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
							POLLUTANT LEVELS
						</span>

						{pollutants.map((p) => (
							<PollutantBar
								key={p.label}
								label={p.label}
								value={p.value}
								unit={p.unit}
								max={p.max}
								color={getPollutantColor(p.value, p.max)}
							/>
						))}
					</div>
				</div>

				{/* ── Health advice ─────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						padding: "8px 20px",
						borderTop: `2px solid ${C.black}`,
					}}
				>
					<div
						style={{
							width: "4px",
							height: "28px",
							backgroundColor: level.color,
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
								lineHeight: 1.3,
							}}
						>
							{level.advice}
						</span>
					</div>
				</div>

				{/* ── Footer ───────────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						padding: "6px 20px",
						justifyContent: "space-between",
						fontSize: "10px",
						color: C.black,
					}}
				>
					<span>Data from Open-Meteo Air Quality API</span>
					<span>Updated: {lastUpdated}</span>
				</div>
			</div>
		</PreSatori>
	);
}
