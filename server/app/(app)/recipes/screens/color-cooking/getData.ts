import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

interface Ingredient {
	name: string;
	measure: string;
}

interface CookingData {
	mealName: string;
	category: string;
	area: string;
	ingredients: Ingredient[];
	instructions: string;
	mealThumb: string;
	recipeUrl: string;
	qrCodeUrl: string;
	date: string;
}

function getFormattedDate(): string {
	const now = new Date();
	return now
		.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		})
		.toUpperCase();
}

function getFallbackMeal(): CookingData {
	return {
		mealName: "Classic Margherita Pizza",
		category: "Miscellaneous",
		area: "Italian",
		ingredients: [
			{ name: "Pizza dough", measure: "1 ball" },
			{ name: "San Marzano tomatoes", measure: "1 can" },
			{ name: "Fresh mozzarella", measure: "200g" },
			{ name: "Fresh basil", measure: "handful" },
			{ name: "Olive oil", measure: "2 tbsp" },
			{ name: "Salt", measure: "to taste" },
			{ name: "Garlic", measure: "2 cloves" },
			{ name: "Oregano", measure: "1 tsp" },
		],
		instructions:
			"Stretch dough into a circle on a floured surface. Spread crushed tomatoes evenly, leaving a border for the crust. Tear mozzarella and distribute over sauce. Bake at 250°C (480°F) for 8-10 minutes until crust is golden and cheese is bubbly. Finish with fresh basil and a drizzle of olive oil.",
		mealThumb:
			"https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
		recipeUrl: "https://www.themealdb.com",
		qrCodeUrl: "",
		date: getFormattedDate(),
	};
}

async function fetchRandomMeal(cuisine?: string): Promise<CookingData> {
	try {
		let meal: Record<string, string | null> | null = null;

		if (cuisine) {
			// Filter by area/cuisine, then pick one deterministically by day-of-year
			const filterRes = await fetch(
				`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(cuisine)}`,
				{ headers: { Accept: "application/json" }, next: { revalidate: 0 } },
			);
			if (filterRes.ok) {
				const filterData = await filterRes.json();
				const meals = filterData.meals;
				if (meals && meals.length > 0) {
					const now = new Date();
					const start = new Date(now.getFullYear(), 0, 0);
					const dayOfYear = Math.floor(
						(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
					);
					const picked = meals[dayOfYear % meals.length];
					// Look up full details
					const lookupRes = await fetch(
						`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${picked.idMeal}`,
						{
							headers: { Accept: "application/json" },
							next: { revalidate: 0 },
						},
					);
					if (lookupRes.ok) {
						const lookupData = await lookupRes.json();
						meal = lookupData.meals?.[0] || null;
					}
				}
			}
		}

		// Fallback to random meal if no cuisine specified or cuisine fetch failed
		if (!meal) {
			const response = await fetch(
				"https://www.themealdb.com/api/json/v1/1/random.php",
				{
					headers: { Accept: "application/json" },
					next: { revalidate: 0 },
				},
			);
			if (!response.ok) return getFallbackMeal();
			const data = await response.json();
			meal = data.meals?.[0] || null;
		}

		if (!meal) return getFallbackMeal();

		// Extract ingredients (up to 20 possible)
		const ingredients: Ingredient[] = [];
		for (let i = 1; i <= 20; i++) {
			const name = meal[`strIngredient${i}`]?.trim();
			const measure = meal[`strMeasure${i}`]?.trim();
			if (name) {
				ingredients.push({ name, measure: measure || "" });
			}
		}

		const recipeUrl =
			meal.strSource || `https://www.themealdb.com/meal/${meal.idMeal}`;

		// Build QR code URL using goqr.me API
		const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(recipeUrl)}&format=png&margin=4`;

		return {
			mealName: meal.strMeal || "Mystery Dish",
			category: meal.strCategory || "Unknown",
			area: meal.strArea || "International",
			ingredients: ingredients.slice(0, 10),
			instructions: (meal.strInstructions || "")
				.replace(/\r\n/g, " ")
				.replace(/\n/g, " ")
				.trim(),
			mealThumb: meal.strMealThumb || "",
			recipeUrl,
			qrCodeUrl,
			date: getFormattedDate(),
		};
	} catch {
		return getFallbackMeal();
	}
}

const getCachedMeal = unstable_cache(
	async (cuisine: string): Promise<CookingData> => {
		const data = await fetchRandomMeal(cuisine || undefined);
		if (data.mealName === "Mystery Dish") {
			throw new Error("Empty data - skip caching");
		}
		return data;
	},
	["color-cooking-data"],
	{ tags: ["color-cooking"], revalidate: 86400 }, // 24 hours = daily recipe
);

type CookingParams = {
	cuisine?: string;
};

export default async function getData(
	params?: CookingParams,
): Promise<CookingData> {
	const cuisine = params?.cuisine || "";
	try {
		return await getCachedMeal(cuisine);
	} catch {
		return fetchRandomMeal(cuisine || undefined);
	}
}
