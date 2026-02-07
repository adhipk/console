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

/* ── Accent color by category ──────────────────────────────────────── */
const CATEGORY_ACCENT: Record<string, string> = {
	Wisdom: C.blue,
	Design: C.orange,
	Work: C.green,
	Resilience: C.red,
	Motivation: C.orange,
	Growth: C.green,
	Identity: C.blue,
	Purpose: C.yellow,
	Creativity: C.orange,
	Action: C.red,
	Mindfulness: C.green,
	Happiness: C.yellow,
	Life: C.blue,
	Perseverance: C.red,
	Philosophy: C.blue,
	Perspective: C.green,
	Simplicity: C.yellow,
	Courage: C.red,
	Adventure: C.orange,
	Authenticity: C.green,
	Gratitude: C.yellow,
};

/* ── Decorative quote mark ─────────────────────────────────────────── */
function QuoteMark({ color }: { color: string }) {
	return (
		<svg
			role="img"
			aria-label="Quote"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 80"
			width="60"
			height="48"
		>
			<path
				d="M20 60C8.95 60 0 51.05 0 40C0 17.9 17.9 0 40 0L40 12C24.54 12 12 24.54 12 40L20 40C26.63 40 32 45.37 32 52C32 56.42 26.63 60 20 60zM60 60C48.95 60 40 51.05 40 40C40 17.9 57.9 0 80 0L80 12C64.54 12 52 24.54 52 40L60 40C66.63 40 72 45.37 72 52C72 56.42 66.63 60 60 60z"
				fill={color}
				opacity="0.8"
			/>
		</svg>
	);
}

/* ── Dynamic defaults ──────────────────────────────────────────────── */
function getDefaultDate() {
	return new Date()
		.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})
		.toUpperCase();
}

function getDefaultDayNumber() {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = now.getTime() - start.getTime();
	return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const QUOTES = [
	{ text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Wisdom" },
	{ text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "Design" },
	{ text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Work" },
	{ text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Resilience" },
	{ text: "What you do today can improve all your tomorrows.", author: "Ralph Marston", category: "Motivation" },
	{ text: "It is not the mountain we conquer, but ourselves.", author: "Edmund Hillary", category: "Growth" },
	{ text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", category: "Wisdom" },
	{ text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "Identity" },
];

function getDefaultQuote() {
	const dayNumber = getDefaultDayNumber();
	return QUOTES[dayNumber % QUOTES.length];
}

/* ── Prop types ─────────────────────────────────────────────────────── */
interface DailyQuoteProps {
	text?: string;
	author?: string;
	category?: string;
	date?: string;
	dayNumber?: number;
	width?: number;
	height?: number;
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function DailyQuote({
	text = getDefaultQuote().text,
	author = getDefaultQuote().author,
	category = getDefaultQuote().category,
	date = getDefaultDate(),
	dayNumber = getDefaultDayNumber(),
	width = 800,
	height = 480,
}: DailyQuoteProps) {
	const accent = CATEGORY_ACCENT[category] || C.orange;

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
				{/* ── Top accent bar ───────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						height: "6px",
						backgroundColor: accent,
						width: "100%",
					}}
				/>

				{/* ── Main content ────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						padding: "32px 40px",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{/* Quote mark */}
					<div style={{ display: "flex", marginBottom: "16px" }}>
						<QuoteMark color={accent} />
					</div>

					{/* Quote text */}
					<div
						style={{
							display: "flex",
							textAlign: "center",
							fontSize: "24px",
							fontWeight: 600,
							color: C.black,
							lineHeight: 1.4,
							maxWidth: "480px",
						}}
					>
						{text}
					</div>

					{/* Divider */}
					<div
						style={{
							display: "flex",
							width: "60px",
							height: "3px",
							backgroundColor: accent,
							borderRadius: "2px",
							marginTop: "24px",
							marginBottom: "16px",
						}}
					/>

					{/* Author */}
					<div
						style={{
							display: "flex",
							fontSize: "16px",
							fontWeight: 700,
							color: C.black,
						}}
					>
						{author}
					</div>
				</div>

				{/* ── Footer ───────────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						padding: "12px 24px",
						borderTop: `1.5px solid #E0E0E0`,
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<div
							style={{
								width: "10px",
								height: "10px",
								borderRadius: "5px",
								backgroundColor: accent,
								marginRight: "8px",
							}}
						/>
						<span
							style={{
								fontSize: "12px",
								color: C.black,
								fontWeight: 500,
								textTransform: "uppercase",
								letterSpacing: "1px",
							}}
						>
							{category}
						</span>
					</div>
					<span
						style={{
							fontSize: "11px",
							color: C.black,
							fontWeight: 400,
						}}
					>
						{date}
					</span>
					<span
						style={{
							fontSize: "11px",
							color: C.black,
							fontWeight: 400,
						}}
					>
						Day {dayNumber}
					</span>
				</div>
			</div>
		</PreSatori>
	);
}
