import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

type GooglePhotosData = {
	title: string;
	photoUrl: string;
	albumHost: string;
	albumUrl: string;
	updatedAt: string;
	status: "ok" | "no_album_url" | "invalid_url" | "fetch_failed" | "no_images";
	error?: string;
};

type GooglePhotosParams = {
	albumUrl?: string;
	title?: string;
};

const DEFAULT_TITLE = "Google Photos";

function getFormattedDate(): string {
	return new Date().toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

function fallbackData(
	status: GooglePhotosData["status"],
	albumUrl: string,
	title: string,
	error?: string,
): GooglePhotosData {
	return {
		title: title || DEFAULT_TITLE,
		photoUrl: "",
		albumHost: "photos.google.com",
		albumUrl,
		updatedAt: getFormattedDate(),
		status,
		...(error ? { error } : {}),
	};
}

function isGooglePhotosSharedAlbumUrl(input: string): boolean {
	try {
		const url = new URL(input);
		const host = url.hostname.toLowerCase();
		return (
			host === "photos.google.com" ||
			host.endsWith(".photos.google.com") ||
			host === "www.google.com"
		);
	} catch {
		return false;
	}
}

function normalizeExtractedUrl(raw: string): string {
	const decoded = raw
		.replace(/\\u0026/g, "&")
		.replace(/\\u003d/g, "=")
		.replace(/\\\//g, "/")
		.replace(/&amp;/g, "&");

	// Strip trailing encoded quotes or escapes
	return decoded.replace(/\\+$/g, "").replace(/^"+|"+$/g, "");
}

function extractImageCandidates(html: string): string[] {
	const patterns: RegExp[] = [
		/"(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g,
		/"(https:\/\/lh\d+\.googleusercontent\.com\/[^"]+)"/g,
		/"url":"(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g,
		/(https:\/\/lh3\.googleusercontent\.com\/[^\s"'<>\\]+)/g,
	];

	const urls = new Set<string>();
	for (const pattern of patterns) {
		for (const match of html.matchAll(pattern)) {
			const candidate = normalizeExtractedUrl(match[1] || match[0] || "");
			if (
				candidate.startsWith("https://lh") &&
				candidate.includes("googleusercontent.com")
			) {
				urls.add(candidate);
			}
		}
	}

	return Array.from(urls);
}

function pickDailyImage(urls: string[]): string {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const dayOfYear = Math.floor(
		(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
	);
	return urls[dayOfYear % urls.length];
}

async function fetchGooglePhotoData(
	albumUrl: string,
	title: string,
): Promise<GooglePhotosData> {
	if (!albumUrl) {
		return fallbackData("no_album_url", albumUrl, title);
	}

	if (!isGooglePhotosSharedAlbumUrl(albumUrl)) {
		return fallbackData(
			"invalid_url",
			albumUrl,
			title,
			"Expected a Google Photos shared album link",
		);
	}

	try {
		const response = await fetch(albumUrl, {
			headers: {
				Accept: "text/html,application/xhtml+xml",
				"User-Agent": "Mozilla/5.0 (compatible; TRMNL/1.0; +https://trmnl.com)",
			},
			next: { revalidate: 0 },
		});

		if (!response.ok) {
			return fallbackData(
				"fetch_failed",
				albumUrl,
				title,
				`Album fetch failed with status ${response.status}`,
			);
		}

		const html = await response.text();
		const imageCandidates = extractImageCandidates(html);

		if (imageCandidates.length === 0) {
			return fallbackData(
				"no_images",
				albumUrl,
				title,
				"No image URLs found in album page",
			);
		}

		const picked = pickDailyImage(imageCandidates);
		const host = new URL(albumUrl).hostname;

		return {
			title: title || DEFAULT_TITLE,
			photoUrl: picked,
			albumHost: host,
			albumUrl,
			updatedAt: getFormattedDate(),
			status: "ok",
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return fallbackData("fetch_failed", albumUrl, title, message);
	}
}

const getCachedGooglePhotoData = unstable_cache(
	async (albumUrl: string, title: string): Promise<GooglePhotosData> => {
		const data = await fetchGooglePhotoData(albumUrl, title);
		if (data.status !== "ok") {
			throw new Error("Skip caching fallback response");
		}
		return data;
	},
	["color-google-photos-data"],
	{ tags: ["color-google-photos"], revalidate: 3600 },
);

export default async function getData(
	params?: GooglePhotosParams,
): Promise<GooglePhotosData> {
	const albumUrl = params?.albumUrl?.trim() || "";
	const title = params?.title?.trim() || DEFAULT_TITLE;

	try {
		return await getCachedGooglePhotoData(albumUrl, title);
	} catch {
		return fetchGooglePhotoData(albumUrl, title);
	}
}
