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

const CATEGORY_COLORS: Record<string, string> = {
	work: C.blue,
	personal: C.green,
	health: C.red,
	social: C.orange,
};

const PRIORITY_COLORS: Record<string, string> = {
	high: C.red,
	medium: C.orange,
	low: C.green,
};

/* ── Prop types ─────────────────────────────────────────────────────── */
interface AgendaEvent {
	time: string;
	title: string;
	duration: string;
	category: "work" | "personal" | "health" | "social";
}

interface AgendaSection {
	label: string;
	events: AgendaEvent[];
}

interface Task {
	title: string;
	done: boolean;
	priority: "high" | "medium" | "low";
}

interface DailyAgendaProps {
	date?: string;
	dayOfWeek?: string;
	daysUntilWeekend?: number;
	sections?: AgendaSection[];
	tasks?: Task[];
	width?: number;
	height?: number;
}

/* ── Checkbox icon ─────────────────────────────────────────────────── */
function Checkbox({ done }: { done: boolean }) {
	if (done) {
		return (
			<svg
				role="img"
				aria-label="Completed"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				width="16"
				height="16"
			>
				<rect
					x="1"
					y="1"
					width="18"
					height="18"
					rx="3"
					fill={C.green}
					stroke={C.green}
					strokeWidth="1.5"
				/>
				<path
					d="M6 10l3 3 5-6"
					stroke={C.white}
					strokeWidth="2.5"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}
	return (
		<svg
			role="img"
			aria-label="Pending"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			width="16"
			height="16"
		>
			<rect
				x="1"
				y="1"
				width="18"
				height="18"
				rx="3"
				fill="none"
				stroke={C.black}
				strokeWidth="1.5"
			/>
		</svg>
	);
}

/* ── Dynamic defaults ──────────────────────────────────────────────── */
function getDefaultDate() {
	return new Date()
		.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		})
		.toUpperCase();
}

function getDefaultDayOfWeek() {
	return new Date()
		.toLocaleDateString("en-US", { weekday: "long" })
		.toUpperCase();
}

function getDefaultDaysUntilWeekend() {
	const dayIndex = new Date().getDay(); // 0=Sun, 6=Sat
	return dayIndex === 0 || dayIndex === 6 ? 0 : 6 - dayIndex;
}

function getDefaultSections(): AgendaSection[] {
	const now = new Date();
	const hour = now.getHours();

	const morning: AgendaEvent[] = [
		{
			time: "8:30 AM",
			title: "Morning coffee & review",
			duration: "30m",
			category: "personal",
		},
		{
			time: "9:00 AM",
			title: "Team standup",
			duration: "15m",
			category: "work",
		},
		{
			time: "10:00 AM",
			title: "Deep work block",
			duration: "2h",
			category: "work",
		},
	];
	const afternoon: AgendaEvent[] = [
		{
			time: "12:30 PM",
			title: "Lunch break",
			duration: "1h",
			category: "social",
		},
		{
			time: "2:00 PM",
			title: "Project review",
			duration: "1h",
			category: "work",
		},
		{
			time: "3:30 PM",
			title: "Gym session",
			duration: "1h",
			category: "health",
		},
	];
	const evening: AgendaEvent[] = [
		{
			time: "6:00 PM",
			title: "Dinner prep",
			duration: "45m",
			category: "personal",
		},
		{
			time: "8:00 PM",
			title: "Read / wind down",
			duration: "1h",
			category: "personal",
		},
	];

	const dayOfWeek = now.getDay();
	// Vary events slightly based on day of week
	if (dayOfWeek === 1)
		morning[2] = {
			time: "10:00 AM",
			title: "Sprint planning",
			duration: "1h",
			category: "work",
		};
	if (dayOfWeek === 3)
		afternoon[1] = {
			time: "2:00 PM",
			title: "1:1 with manager",
			duration: "30m",
			category: "work",
		};
	if (dayOfWeek === 5)
		afternoon[2] = {
			time: "3:30 PM",
			title: "Team retro",
			duration: "1h",
			category: "work",
		};
	if (dayOfWeek === 0 || dayOfWeek === 6) {
		morning.splice(1, 2, {
			time: "10:00 AM",
			title: "Weekend errands",
			duration: "2h",
			category: "personal",
		});
		afternoon.splice(
			0,
			3,
			{
				time: "1:00 PM",
				title: "Lunch out",
				duration: "1h",
				category: "social",
			},
			{
				time: "3:00 PM",
				title: "Outdoor walk",
				duration: "1h",
				category: "health",
			},
		);
	}

	return [
		{ label: "MORNING", events: morning },
		{ label: "AFTERNOON", events: afternoon },
		{ label: "EVENING", events: evening },
	];
}

function getDefaultTasks(): Task[] {
	const dayOfWeek = new Date().getDay();
	const weekdayTasks: Task[] = [
		{ title: "Review pull requests", done: false, priority: "high" },
		{ title: "Reply to emails", done: false, priority: "high" },
		{ title: "Update project docs", done: false, priority: "medium" },
		{ title: "Grocery shopping", done: false, priority: "low" },
		{ title: "Schedule appointments", done: false, priority: "low" },
	];
	const weekendTasks: Task[] = [
		{ title: "Meal prep for the week", done: false, priority: "high" },
		{ title: "Clean the house", done: false, priority: "medium" },
		{ title: "Call family", done: false, priority: "medium" },
		{ title: "Read a book chapter", done: false, priority: "low" },
		{ title: "Plan next week", done: false, priority: "low" },
	];
	return dayOfWeek === 0 || dayOfWeek === 6 ? weekendTasks : weekdayTasks;
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function DailyAgenda({
	date = getDefaultDate(),
	dayOfWeek = getDefaultDayOfWeek(),
	daysUntilWeekend = getDefaultDaysUntilWeekend(),
	sections = getDefaultSections(),
	tasks = getDefaultTasks(),
	width = 800,
	height = 480,
}: DailyAgendaProps) {
	const completedCount = tasks.filter((t) => t.done).length;

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
						padding: "12px 20px",
						backgroundColor: C.green,
						color: C.white,
					}}
				>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<span style={{ fontSize: "22px", fontWeight: 700 }}>
							{dayOfWeek}
						</span>
						<span style={{ fontSize: "12px", fontWeight: 400 }}>{date}</span>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
						}}
					>
						{daysUntilWeekend > 0 ? (
							<span style={{ fontSize: "14px", fontWeight: 600 }}>
								{daysUntilWeekend} day{daysUntilWeekend > 1 ? "s" : ""} to
								weekend
							</span>
						) : (
							<span style={{ fontSize: "14px", fontWeight: 600 }}>
								Weekend!
							</span>
						)}
						<span style={{ fontSize: "11px", fontWeight: 400 }}>
							{completedCount}/{tasks.length} tasks done
						</span>
					</div>
				</div>

				{/* ── Main content: Agenda + Tasks ─────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						flex: 1,
						padding: "10px 12px",
						overflow: "hidden",
					}}
				>
					{/* ── Left: Schedule ────────────────────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "60%",
							paddingRight: "12px",
							borderRight: `2px solid ${C.black}`,
						}}
					>
						{sections.map((section) => (
							<div
								key={section.label}
								style={{
									display: "flex",
									flexDirection: "column",
									marginBottom: "8px",
								}}
							>
								<span
									style={{
										fontSize: "10px",
										fontWeight: 700,
										color: C.black,
										letterSpacing: "1.5px",
										marginBottom: "4px",
										opacity: 0.5,
									}}
								>
									{section.label}
								</span>
								{section.events.map((event, i) => (
									<div
										key={i}
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											marginBottom: "4px",
										}}
									>
										<div
											style={{
												width: "3px",
												height: "28px",
												backgroundColor:
													CATEGORY_COLORS[event.category] || C.black,
												borderRadius: "2px",
												marginRight: "8px",
												flexShrink: 0,
											}}
										/>
										<span
											style={{
												fontSize: "11px",
												color: C.black,
												fontWeight: 400,
												width: "58px",
												flexShrink: 0,
											}}
										>
											{event.time}
										</span>
										<span
											style={{
												fontSize: "13px",
												color: C.black,
												fontWeight: 600,
												flex: 1,
											}}
										>
											{event.title}
										</span>
										<span
											style={{
												fontSize: "10px",
												color: C.black,
												fontWeight: 400,
												opacity: 0.5,
											}}
										>
											{event.duration}
										</span>
									</div>
								))}
							</div>
						))}

						{/* ── Category legend ──────────────────────────── */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								marginTop: "auto",
								paddingTop: "6px",
								borderTop: `1px solid #E0E0E0`,
							}}
						>
							{Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
								<div
									key={cat}
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										marginRight: "12px",
									}}
								>
									<div
										style={{
											width: "8px",
											height: "8px",
											borderRadius: "4px",
											backgroundColor: color,
											marginRight: "4px",
										}}
									/>
									<span
										style={{
											fontSize: "9px",
											color: C.black,
											textTransform: "capitalize",
										}}
									>
										{cat}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* ── Right: Tasks ──────────────────────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "40%",
							paddingLeft: "12px",
						}}
					>
						<span
							style={{
								fontSize: "13px",
								fontWeight: 700,
								color: C.black,
								letterSpacing: "1px",
								marginBottom: "10px",
							}}
						>
							TASKS
						</span>

						{tasks.map((task, i) => (
							<div
								key={i}
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									marginBottom: "8px",
								}}
							>
								<Checkbox done={task.done} />
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										marginLeft: "8px",
										flex: 1,
									}}
								>
									<span
										style={{
											fontSize: "13px",
											color: task.done ? "#999999" : C.black,
											fontWeight: task.done ? 400 : 600,
											textDecoration: task.done ? "line-through" : "none",
										}}
									>
										{task.title}
									</span>
								</div>
								{!task.done && (
									<div
										style={{
											width: "8px",
											height: "8px",
											borderRadius: "4px",
											backgroundColor:
												PRIORITY_COLORS[task.priority] || C.black,
											flexShrink: 0,
										}}
									/>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</PreSatori>
	);
}
