import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

interface QuoteData {
	text: string;
	author: string;
	category: string;
	date: string;
	dayNumber: number;
}

const QUOTES = [
	{
		text: "The best time to plant a tree was 20 years ago. The second best time is now.",
		author: "Chinese Proverb",
		category: "Wisdom",
	},
	{
		text: "Simplicity is the ultimate sophistication.",
		author: "Leonardo da Vinci",
		category: "Design",
	},
	{
		text: "The only way to do great work is to love what you do.",
		author: "Steve Jobs",
		category: "Work",
	},
	{
		text: "In the middle of difficulty lies opportunity.",
		author: "Albert Einstein",
		category: "Resilience",
	},
	{
		text: "What you do today can improve all your tomorrows.",
		author: "Ralph Marston",
		category: "Motivation",
	},
	{
		text: "It is not the mountain we conquer, but ourselves.",
		author: "Edmund Hillary",
		category: "Growth",
	},
	{
		text: "The journey of a thousand miles begins with a single step.",
		author: "Lao Tzu",
		category: "Wisdom",
	},
	{
		text: "Be yourself; everyone else is already taken.",
		author: "Oscar Wilde",
		category: "Identity",
	},
	{
		text: "Act as if what you do makes a difference. It does.",
		author: "William James",
		category: "Purpose",
	},
	{
		text: "Everything you can imagine is real.",
		author: "Pablo Picasso",
		category: "Creativity",
	},
	{
		text: "Do what you can, with what you have, where you are.",
		author: "Theodore Roosevelt",
		category: "Action",
	},
	{
		text: "The mind is everything. What you think you become.",
		author: "Buddha",
		category: "Mindfulness",
	},
	{
		text: "Happiness is not something ready made. It comes from your own actions.",
		author: "Dalai Lama",
		category: "Happiness",
	},
	{
		text: "The purpose of our lives is to be happy.",
		author: "Dalai Lama",
		category: "Purpose",
	},
	{
		text: "Life is what happens when you're busy making other plans.",
		author: "John Lennon",
		category: "Life",
	},
	{
		text: "Get busy living or get busy dying.",
		author: "Stephen King",
		category: "Life",
	},
	{
		text: "You only live once, but if you do it right, once is enough.",
		author: "Mae West",
		category: "Life",
	},
	{
		text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
		author: "Thomas Edison",
		category: "Perseverance",
	},
	{
		text: "The unexamined life is not worth living.",
		author: "Socrates",
		category: "Philosophy",
	},
	{
		text: "Turn your wounds into wisdom.",
		author: "Oprah Winfrey",
		category: "Growth",
	},
	{
		text: "The way to get started is to quit talking and begin doing.",
		author: "Walt Disney",
		category: "Action",
	},
	{
		text: "If life were predictable it would cease to be life, and be without flavor.",
		author: "Eleanor Roosevelt",
		category: "Life",
	},
	{
		text: "In three words I can sum up everything I've learned about life: it goes on.",
		author: "Robert Frost",
		category: "Perspective",
	},
	{
		text: "Life is really simple, but we insist on making it complicated.",
		author: "Confucius",
		category: "Simplicity",
	},
	{
		text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
		author: "Nelson Mandela",
		category: "Resilience",
	},
	{
		text: "Never let the fear of striking out keep you from playing the game.",
		author: "Babe Ruth",
		category: "Courage",
	},
	{
		text: "Life is either a daring adventure or nothing at all.",
		author: "Helen Keller",
		category: "Adventure",
	},
	{
		text: "The secret of getting ahead is getting started.",
		author: "Mark Twain",
		category: "Action",
	},
	{
		text: "It's not whether you get knocked down, it's whether you get up.",
		author: "Vince Lombardi",
		category: "Resilience",
	},
	{
		text: "Your time is limited, don't waste it living someone else's life.",
		author: "Steve Jobs",
		category: "Authenticity",
	},
	{
		text: "If you look at what you have in life, you'll always have more.",
		author: "Oprah Winfrey",
		category: "Gratitude",
	},
];

function getDayOfYear(): number {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = now.getTime() - start.getTime();
	return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getFormattedDate(): string {
	const now = new Date();
	return now
		.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})
		.toUpperCase();
}

const getCachedQuote = unstable_cache(
	async (): Promise<QuoteData> => {
		const dayNumber = getDayOfYear();
		const quote = QUOTES[dayNumber % QUOTES.length];
		return {
			...quote,
			date: getFormattedDate(),
			dayNumber,
		};
	},
	["daily-quote-data"],
	{
		tags: ["daily-quote"],
		revalidate: 3600, // 1 hour
	},
);

export default async function getData(): Promise<QuoteData> {
	try {
		return await getCachedQuote();
	} catch {
		const dayNumber = getDayOfYear();
		const quote = QUOTES[dayNumber % QUOTES.length];
		return {
			...quote,
			date: getFormattedDate(),
			dayNumber,
		};
	}
}
