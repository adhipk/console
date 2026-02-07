import type { NextRequest } from "next/server";
import { cache } from "react";
import sharp from "sharp";
import NotFoundScreen from "@/app/(app)/recipes/screens/not-found/not-found";
import screens from "@/app/(app)/recipes/screens.json";
import {
	addDimensionsToProps,
	buildRecipeElement,
	DEFAULT_IMAGE_HEIGHT,
	DEFAULT_IMAGE_WIDTH,
	getRecipeImageOptions,
	logger,
	renderRecipeOutputs,
} from "@/lib/recipes/recipe-renderer";

/**
 * Color PNG endpoint for e-ink displays.
 * Unlike /api/bitmap which outputs 1-bit dithered BMP,
 * this serves full-color PNG at the requested dimensions.
 * Ideal for 7-color e-ink displays like the Inky Impression.
 */
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	try {
		const { slug = ["not-found"] } = await params;
		const pngPath = Array.isArray(slug) ? slug.join("/") : slug;
		const recipeSlug = pngPath.replace(".png", "");

		const { searchParams } = new URL(req.url);
		const widthParam = searchParams.get("width");
		const heightParam = searchParams.get("height");

		const width = widthParam ? parseInt(widthParam, 10) : DEFAULT_IMAGE_WIDTH;
		const height = heightParam
			? parseInt(heightParam, 10)
			: DEFAULT_IMAGE_HEIGHT;

		const validWidth = width > 0 ? width : DEFAULT_IMAGE_WIDTH;
		const validHeight = height > 0 ? height : DEFAULT_IMAGE_HEIGHT;

		logger.info(
			`Color PNG request for: ${pngPath} in ${validWidth}x${validHeight}`,
		);

		const recipeId = screens[recipeSlug as keyof typeof screens]
			? recipeSlug
			: "simple-text";

		const pngBuffer = await renderRecipePng(recipeId, validWidth, validHeight);

		if (
			!pngBuffer ||
			!(pngBuffer instanceof Buffer) ||
			pngBuffer.length === 0
		) {
			logger.warn(`Failed to generate PNG for ${recipeId}, returning fallback`);
			return await renderFallbackPng();
		}

		return new Response(new Uint8Array(pngBuffer), {
			headers: {
				"Content-Type": "image/png",
				"Content-Length": pngBuffer.length.toString(),
				"Cache-Control": "public, max-age=900",
			},
		});
	} catch (error) {
		logger.error("Error generating PNG:", error);
		return await renderFallbackPng("Error occurred");
	}
}

const renderRecipePng = cache(
	async (recipeId: string, width: number, height: number) => {
		const { config, Component, props, element } = await buildRecipeElement({
			slug: recipeId,
		});

		const ComponentToRender =
			Component ??
			(() => {
				return element;
			});

		const propsWithDimensions = addDimensionsToProps(props, width, height);

		const renders = await renderRecipeOutputs({
			slug: recipeId,
			Component: ComponentToRender,
			props: propsWithDimensions,
			config: config ?? null,
			imageWidth: width,
			imageHeight: height,
			formats: ["png"],
		});

		let pngBuffer = renders.png ?? Buffer.from([]);

		// If doubleSizeForSharperText is enabled, the renderer outputs at 2x.
		// Downscale back to the requested dimensions for the display.
		if (pngBuffer.length > 0) {
			const imageOptions = getRecipeImageOptions(config ?? null, width, height);
			if (imageOptions.width !== width || imageOptions.height !== height) {
				pngBuffer = await sharp(pngBuffer)
					.resize(width, height, { fit: "fill" })
					.png()
					.toBuffer();
			}
		}

		return pngBuffer;
	},
);

const renderFallbackPng = cache(async (slug: string = "not-found") => {
	try {
		const renders = await renderRecipeOutputs({
			slug,
			Component: NotFoundScreen,
			props: { slug },
			config: null,
			imageWidth: DEFAULT_IMAGE_WIDTH,
			imageHeight: DEFAULT_IMAGE_HEIGHT,
			formats: ["png"],
		});

		if (!renders.png) {
			throw new Error("Missing PNG buffer for fallback");
		}

		return new Response(new Uint8Array(renders.png), {
			headers: {
				"Content-Type": "image/png",
				"Content-Length": renders.png.length.toString(),
			},
		});
	} catch (fallbackError) {
		logger.error("Error generating fallback PNG:", fallbackError);
		return new Response("Error generating image", {
			status: 500,
			headers: { "Content-Type": "text/plain" },
		});
	}
});
