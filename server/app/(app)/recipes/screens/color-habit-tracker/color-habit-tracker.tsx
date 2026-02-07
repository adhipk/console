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

/* ── Status cell icons ─────────────────────────────────────────────── */
function StatusCell({ status }: { status: "done" | "missed" | "partial" | "rest" | "future" }) {
	const size = 28;
	const half = size / 2;

	if (status === "done") {
		return (
			<svg
				role="img"
				aria-label="Done"
				xmlns="http://www.w3.org/2000/svg"
				viewBox={`0 0 ${size} ${size}`}
				width={size}
				height={size}
			>
				<rect x="2" y="2" width={size - 4} height={size - 4} rx="4" fill={C.green} />
				<path
					d="M8 14l4 4 8-8"
					stroke={C.white}
					strokeWidth="2.5"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}
	if (status === "missed") {
		return (
			<svg
				role="img"
				aria-label="Missed"
				xmlns="http://www.w3.org/2000/svg"
				viewBox={`0 0 ${size} ${size}`}
				width={size}
				height={size}
			>
				<rect x="2" y="2" width={size - 4} height={size - 4} rx="4" fill={C.red} />
				<line x1="9" y1="9" x2="19" y2="19" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" />
				<line x1="19" y1="9" x2="9" y2="19" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" />
			</svg>
		);
	}
	if (status === "partial") {
		return (
			<svg
				role="img"
				aria-label="Partial"
				xmlns="http://www.w3.org/2000/svg"
				viewBox={`0 0 ${size} ${size}`}
				width={size}
				height={size}
			>
				<rect x="2" y="2" width={size - 4} height={size - 4} rx="4" fill={C.yellow} />
				<circle cx={half} cy={half} r="4" fill={C.black} />
			</svg>
		);
	}
	if (status === "rest") {
		return (
			<svg
				role="img"
				aria-label="Rest day"
				xmlns="http://www.w3.org/2000/svg"
				viewBox={`0 0 ${size} ${size}`}
				width={size}
				height={size}
			>
				<rect x="2" y="2" width={size - 4} height={size - 4} rx="4" fill="#F0F0F0" stroke="#D0D0D0" strokeWidth="1" />
				<line x1="8" y1={half} x2="20" y2={half} stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round" />
			</svg>
		);
	}
	// future
	return (
		<svg
			role="img"
			aria-label="Future"
			xmlns="http://www.w3.org/2000/svg"
			viewBox={`0 0 ${size} ${size}`}
			width={size}
			height={size}
		>
			<rect x="2" y="2" width={size - 4} height={size - 4} rx="4" fill="none" stroke="#D0D0D0" strokeWidth="1.5" />
		</svg>
	);
}

/* ── Streak fire icon ──────────────────────────────────────────────── */
function FireIcon({ size = 14 }: { size?: number }) {
	return (
		<svg
			role="img"
			aria-label="Streak"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
		>
			<path
				d="M12 2C12 2 8 8 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 8 12 2 12 2Z"
				fill={C.orange}
				stroke={C.red}
				strokeWidth="1.5"
			/>
			<path
				d="M12 10C12 10 10.5 12 10.5 13.5C10.5 14.33 11.17 15 12 15C12.83 15 13.5 14.33 13.5 13.5C13.5 12 12 10 12 10Z"
				fill={C.yellow}
			/>
		</svg>
	);
}

/* ── Prop types ─────────────────────────────────────────────────────── */
type HabitStatus = "done" | "missed" | "partial" | "rest" | "future";

interface Habit {
	name: string;
	emoji: string;
	color: string;
	days: HabitStatus[];
	streak: number;
}

interface HabitTrackerProps {
	weekLabel?: string;
	dayLabels?: string[];
	todayIndex?: number;
	habits?: Habit[];
	totalCompletionRate?: number;
	width?: number;
	height?: number;
}

/* ── Dynamic defaults ──────────────────────────────────────────────── */
function getDefaultWeekLabel() {
	const now = new Date();
	const dayOfWeek = now.getDay();
	const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
	const monday = new Date(now);
	monday.setDate(now.getDate() - todayIdx);
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);
	const fmt = (d: Date) =>
		d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
	return `${fmt(monday)} – ${fmt(sunday)}, ${now.getFullYear()}`;
}

function getDefaultTodayIndex() {
	const dayOfWeek = new Date().getDay();
	return dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon=0 ... Sun=6
}

function getDefaultHabits(): Habit[] {
	const todayIdx = getDefaultTodayIndex();

	const habitDefs = [
		{ name: "Exercise", emoji: "💪", color: C.red, restDays: [6] as number[], difficulty: 0.75 },
		{ name: "Reading", emoji: "📖", color: C.blue, restDays: [] as number[], difficulty: 0.85 },
		{ name: "Meditate", emoji: "🧘", color: C.green, restDays: [] as number[], difficulty: 0.7 },
		{ name: "Water 8 cups", emoji: "💧", color: C.blue, restDays: [] as number[], difficulty: 0.8 },
		{ name: "No sugar", emoji: "🍬", color: C.orange, restDays: [] as number[], difficulty: 0.65 },
		{ name: "Sleep by 11", emoji: "😴", color: C.green, restDays: [4, 5] as number[], difficulty: 0.8 },
	];

	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

	const pseudoRandom = (seed: number): number => {
		const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
		return x - Math.floor(x);
	};

	return habitDefs.map((def, habitIdx) => {
		const days: HabitStatus[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((_, dayIdx) => {
			if (dayIdx > todayIdx) return "future";
			if (def.restDays.includes(dayIdx)) return "rest";
			const rand = pseudoRandom(dayOfYear * 100 + habitIdx * 10 + dayIdx);
			if (rand < def.difficulty) return "done";
			if (rand < def.difficulty + 0.1) return "partial";
			return "missed";
		});

		let streak = 0;
		for (let i = todayIdx; i >= 0; i--) {
			if (days[i] === "done") streak++;
			else if (days[i] === "rest") continue;
			else break;
		}
		if (streak > 0) {
			streak += Math.floor(pseudoRandom(dayOfYear * 50 + habitIdx * 7) * 14);
		}

		return { name: def.name, emoji: def.emoji, color: def.color, days, streak };
	});
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function ColorHabitTracker({
	weekLabel = getDefaultWeekLabel(),
	dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
	todayIndex = getDefaultTodayIndex(),
	habits = getDefaultHabits(),
	totalCompletionRate = 0,
	width = 800,
	height = 480,
}: HabitTrackerProps) {
	const doneCount = habits.reduce(
		(sum, h) => sum + h.days.filter((d) => d === "done").length,
		0,
	);
	const totalPast = habits.reduce(
		(sum, h) => sum + h.days.filter((d) => d !== "future" && d !== "rest").length,
		0,
	);
	const rate = totalPast > 0 ? Math.round((doneCount / totalPast) * 100) : 0;

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
						backgroundColor: C.green,
						color: C.white,
					}}
				>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "1px" }}>
							HABIT TRACKER
						</span>
						<span style={{ fontSize: "12px", fontWeight: 400 }}>{weekLabel}</span>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
						}}
					>
						<span style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1 }}>
							{rate}%
						</span>
						<span style={{ fontSize: "10px", fontWeight: 400 }}>completion</span>
					</div>
				</div>

				{/* ── Day headers row ──────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						padding: "8px 16px 0 16px",
						alignItems: "center",
					}}
				>
					{/* Habit name column spacer */}
					<div style={{ display: "flex", width: "140px" }} />

					{/* Day labels */}
					{dayLabels.map((day, i) => (
						<div
							key={day}
							style={{
								display: "flex",
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<span
								style={{
									fontSize: "11px",
									fontWeight: 700,
									color: i === todayIndex ? C.red : C.black,
									backgroundColor: i === todayIndex ? "#FFE0E0" : "transparent",
									padding: "2px 6px",
									borderRadius: "4px",
								}}
							>
								{day}
							</span>
						</div>
					))}

					{/* Streak column header */}
					<div
						style={{
							display: "flex",
							width: "60px",
							justifyContent: "center",
						}}
					>
						<span style={{ fontSize: "10px", fontWeight: 700, color: C.black }}>
							STREAK
						</span>
					</div>
				</div>

				{/* ── Habit rows ───────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						padding: "4px 16px",
					}}
				>
					{habits.map((habit) => (
						<div
							key={habit.name}
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								padding: "6px 0",
								borderBottom: "1px solid #EEEEEE",
							}}
						>
							{/* Habit name with color indicator */}
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									width: "140px",
								}}
							>
								<div
									style={{
										width: "4px",
										height: "28px",
										backgroundColor: habit.color,
										borderRadius: "2px",
										marginRight: "8px",
										flexShrink: 0,
									}}
								/>
								<span
									style={{
										fontSize: "13px",
										fontWeight: 600,
										color: C.black,
									}}
								>
									{habit.name}
								</span>
							</div>

							{/* Status cells */}
							{habit.days.map((status, i) => (
								<div
									key={i}
									style={{
										display: "flex",
										flex: 1,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<StatusCell status={status} />
								</div>
							))}

							{/* Streak */}
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									width: "60px",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								{habit.streak > 0 && (
									<>
										<FireIcon size={14} />
										<span
											style={{
												fontSize: "14px",
												fontWeight: 700,
												color: habit.streak >= 7 ? C.orange : C.black,
												marginLeft: "3px",
											}}
										>
											{habit.streak}
										</span>
									</>
								)}
							</div>
						</div>
					))}
				</div>

				{/* ── Legend footer ─────────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						padding: "8px 20px",
						justifyContent: "center",
						alignItems: "center",
						borderTop: "1.5px solid #E0E0E0",
					}}
				>
					{(
						[
							["Done", C.green],
							["Partial", C.yellow],
							["Missed", C.red],
							["Rest", "#D0D0D0"],
						] as const
					).map(([label, color]) => (
						<div
							key={label}
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								marginRight: "20px",
							}}
						>
							<div
								style={{
									width: "12px",
									height: "12px",
									borderRadius: "3px",
									backgroundColor: color,
									marginRight: "5px",
								}}
							/>
							<span style={{ fontSize: "10px", color: C.black, fontWeight: 500 }}>
								{label}
							</span>
						</div>
					))}
				</div>
			</div>
		</PreSatori>
	);
}
