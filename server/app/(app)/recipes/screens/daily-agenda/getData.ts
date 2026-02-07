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

function getSampleAgenda(): AgendaSection[] {
	return [
		{
			label: "MORNING",
			events: [
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
			],
		},
		{
			label: "AFTERNOON",
			events: [
				{
					time: "12:30 PM",
					title: "Lunch with Alex",
					duration: "1h",
					category: "social",
				},
				{
					time: "2:00 PM",
					title: "Design review",
					duration: "1h",
					category: "work",
				},
				{
					time: "3:30 PM",
					title: "Gym session",
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
			],
		},
	];
}

function getSampleTasks(): Task[] {
	return [
		{ title: "Ship feature PR", done: false, priority: "high" },
		{ title: "Reply to client email", done: false, priority: "high" },
		{ title: "Update project docs", done: true, priority: "medium" },
		{ title: "Grocery shopping", done: false, priority: "low" },
		{ title: "Schedule dentist appt", done: true, priority: "low" },
	];
}

const getCachedAgendaData = unstable_cache(
	async (): Promise<AgendaData> => {
		const { date, dayOfWeek, daysUntilWeekend } = getDateTime();
		return {
			date,
			dayOfWeek,
			daysUntilWeekend,
			sections: getSampleAgenda(),
			tasks: getSampleTasks(),
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
			sections: getSampleAgenda(),
			tasks: getSampleTasks(),
		};
	}
}
