import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

type HabitStatus = "done" | "missed" | "partial" | "rest" | "future";

interface Habit {
	name: string;
	emoji: string;
	color: string;
	days: HabitStatus[];
	streak: number;
}

interface HabitTrackerData {
	weekLabel: string;
	dayLabels: string[];
	todayIndex: number;
	habits: Habit[];
	totalCompletionRate: number;
}

const C = {
	red: "#E02020",
	green: "#00A000",
	blue: "#0040FF",
	orange: "#FF8000",
} as const;

/* ── Sample habits with deterministic "random" data based on day ──── */
function generateHabitData(): HabitTrackerData {
	const now = new Date();
	const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat
	// Convert to Mon=0 ... Sun=6
	const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

	// Get Monday of current week
	const monday = new Date(now);
	monday.setDate(now.getDate() - todayIndex);

	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);

	const formatShort = (d: Date) =>
		d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

	const weekLabel = `${formatShort(monday).toUpperCase()} – ${formatShort(sunday).toUpperCase()}, ${now.getFullYear()}`;

	const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

	// Use day of year as seed for deterministic variation
	const startOfYear = new Date(now.getFullYear(), 0, 0);
	const diff = now.getTime() - startOfYear.getTime();
	const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

	const habitDefs = [
		{ name: "Exercise", emoji: "💪", color: C.red, restDays: [6], difficulty: 0.75 },
		{ name: "Reading", emoji: "📖", color: C.blue, restDays: [] as number[], difficulty: 0.85 },
		{ name: "Meditate", emoji: "🧘", color: C.green, restDays: [] as number[], difficulty: 0.7 },
		{ name: "Water 8 cups", emoji: "💧", color: C.blue, restDays: [] as number[], difficulty: 0.8 },
		{ name: "No sugar", emoji: "🍬", color: C.orange, restDays: [] as number[], difficulty: 0.65 },
		{ name: "Sleep by 11", emoji: "😴", color: C.green, restDays: [4, 5] as number[], difficulty: 0.8 },
	];

	// Simple pseudo-random based on seed
	const pseudoRandom = (seed: number): number => {
		const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
		return x - Math.floor(x);
	};

	const habits: Habit[] = habitDefs.map((def, habitIdx) => {
		const days: HabitStatus[] = dayLabels.map((_, dayIdx) => {
			if (dayIdx > todayIndex) return "future";
			if (def.restDays.includes(dayIdx)) return "rest";

			const rand = pseudoRandom(dayOfYear * 100 + habitIdx * 10 + dayIdx);
			if (rand < def.difficulty) return "done";
			if (rand < def.difficulty + 0.1) return "partial";
			return "missed";
		});

		// Calculate streak (consecutive done days ending at or before today)
		let streak = 0;
		for (let i = todayIndex; i >= 0; i--) {
			if (days[i] === "done") streak++;
			else if (days[i] === "rest") continue; // skip rest days
			else break;
		}
		// Extend streak into previous weeks (simulate)
		if (streak > 0) {
			const bonus = Math.floor(
				pseudoRandom(dayOfYear * 50 + habitIdx * 7) * 14,
			);
			streak += bonus;
		}

		return {
			name: def.name,
			emoji: def.emoji,
			color: def.color,
			days,
			streak,
		};
	});

	const doneCount = habits.reduce(
		(sum, h) => sum + h.days.filter((d) => d === "done").length,
		0,
	);
	const totalPast = habits.reduce(
		(sum, h) => sum + h.days.filter((d) => d !== "future" && d !== "rest").length,
		0,
	);
	const totalCompletionRate =
		totalPast > 0 ? Math.round((doneCount / totalPast) * 100) : 0;

	return {
		weekLabel,
		dayLabels,
		todayIndex,
		habits,
		totalCompletionRate,
	};
}

const getCachedHabitData = unstable_cache(
	async (): Promise<HabitTrackerData> => {
		return generateHabitData();
	},
	["color-habit-tracker-data"],
	{
		tags: ["color-habit-tracker"],
		revalidate: 300, // 5 minutes
	},
);

export default async function getData(): Promise<HabitTrackerData> {
	try {
		return await getCachedHabitData();
	} catch {
		return generateHabitData();
	}
}
