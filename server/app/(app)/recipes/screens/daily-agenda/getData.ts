import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

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

interface AgendaData {
	date: string;
	dayOfWeek: string;
	daysUntilWeekend: number;
	sections: AgendaSection[];
	tasks: Task[];
}

function getDateTime() {
	const now = new Date();
	const dayOfWeek = now
		.toLocaleDateString("en-US", { weekday: "long" })
		.toUpperCase();
	const date = now
		.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		})
		.toUpperCase();
	const dayIndex = now.getDay(); // 0=Sun, 6=Sat
	const daysUntilWeekend = dayIndex === 0 || dayIndex === 6 ? 0 : 6 - dayIndex;
	return { date, dayOfWeek, daysUntilWeekend };
}

function getAgendaForDay(): AgendaSection[] {
	const dayOfWeek = new Date().getDay(); // 0=Sun, 6=Sat
	const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

	if (isWeekend) {
		return [
			{
				label: "MORNING",
				events: [
					{
						time: "9:00 AM",
						title: "Sleep in & breakfast",
						duration: "1h",
						category: "personal",
					},
					{
						time: "10:30 AM",
						title: "Weekend errands",
						duration: "1.5h",
						category: "personal",
					},
				],
			},
			{
				label: "AFTERNOON",
				events: [
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
				],
			},
			{
				label: "EVENING",
				events: [
					{
						time: "6:00 PM",
						title: "Cook dinner",
						duration: "1h",
						category: "personal",
					},
					{
						time: "8:00 PM",
						title: "Movie night",
						duration: "2h",
						category: "personal",
					},
				],
			},
		];
	}

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

	// Vary based on day of week
	if (dayOfWeek === 1)
		morning[2] = {
			time: "10:00 AM",
			title: "Sprint planning",
			duration: "1h",
			category: "work",
		};
	if (dayOfWeek === 3)
		morning[2] = {
			time: "10:00 AM",
			title: "Architecture review",
			duration: "1.5h",
			category: "work",
		};

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

	if (dayOfWeek === 2)
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

	return [
		{ label: "MORNING", events: morning },
		{ label: "AFTERNOON", events: afternoon },
		{ label: "EVENING", events: evening },
	];
}

function getTasksForDay(): Task[] {
	const dayOfWeek = new Date().getDay();
	const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

	if (isWeekend) {
		return [
			{ title: "Meal prep for the week", done: false, priority: "high" },
			{ title: "Clean the house", done: false, priority: "medium" },
			{ title: "Call family", done: false, priority: "medium" },
			{ title: "Read a book chapter", done: false, priority: "low" },
			{ title: "Plan next week", done: false, priority: "low" },
		];
	}

	return [
		{ title: "Review pull requests", done: false, priority: "high" },
		{ title: "Reply to emails", done: false, priority: "high" },
		{ title: "Update project docs", done: false, priority: "medium" },
		{ title: "Grocery shopping", done: false, priority: "low" },
		{ title: "Schedule appointments", done: false, priority: "low" },
	];
}

const getCachedAgendaData = unstable_cache(
	async (): Promise<AgendaData> => {
		const { date, dayOfWeek, daysUntilWeekend } = getDateTime();
		return {
			date,
			dayOfWeek,
			daysUntilWeekend,
			sections: getAgendaForDay(),
			tasks: getTasksForDay(),
		};
	},
	["daily-agenda-data"],
	{
		tags: ["daily-agenda"],
		revalidate: 300, // 5 minutes
	},
);

export default async function getData(): Promise<AgendaData> {
	try {
		return await getCachedAgendaData();
	} catch {
		const { date, dayOfWeek, daysUntilWeekend } = getDateTime();
		return {
			date,
			dayOfWeek,
			daysUntilWeekend,
			sections: getAgendaForDay(),
			tasks: getTasksForDay(),
		};
	}
}
