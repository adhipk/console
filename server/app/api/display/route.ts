import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { checkDbConnection } from "@/lib/database/utils";
import { logError, logInfo } from "@/lib/logger";
import { DeviceDisplayMode, DeviceDisplayType } from "@/lib/mixup/constants";
import {
	DEFAULT_IMAGE_HEIGHT,
	DEFAULT_IMAGE_WIDTH,
} from "@/lib/recipes/recipe-renderer";
import type { RefreshSchedule } from "@/lib/types";
import {
	buildDisplayResponse,
	buildErrorResponse,
	calculateRefreshRate,
	findOrCreateDevice,
	getActivePlaylistItem,
	parseRequestHeaders,
	precacheImageInBackground,
	updateDeviceStatus,
} from "./utils";

export const DEFAULT_SCREEN = "color-dashboard";
export const DEFAULT_REFRESH_RATE = 900; // 15 minutes, suitable for e-ink

/**
 * Map grayscale value from database to number of gray levels
 * Valid values: 2, 4, or 16. Defaults to 2 if invalid.
 */
function getGrayscaleLevels(grayscale: number | null | undefined): number {
	if (grayscale === 2 || grayscale === 4 || grayscale === 16) {
		return grayscale;
	}
	return 2; // Default to 2 levels (black/white)
}

export async function GET(request: Request) {
	const headers = parseRequestHeaders(request);

	// TRMNL API requires Access-Token header
	if (!headers.apiKey) {
		return NextResponse.json(
			{
				status: 401,
				error: "Access-Token header is required",
			},
			{ status: 401 },
		);
	}

	// log all headers in console for debugging
	console.table(headers);

	const { ready } = await checkDbConnection();
	const baseBmpUrl = `${headers.hostUrl}/api/bitmap`;
	const basePngUrl = `${headers.hostUrl}/api/png`;
	const uniqueId =
		Math.random().toString(36).substring(2, 7) +
		Date.now().toString(36).slice(-3);

	if (!ready) {
		console.warn("Database client not initialized, using noDB mode");
		logInfo("Database client not initialized, using noDB mode", {
			source: "api/display",
			metadata: { headers },
		});
		// Serve color PNG for e-ink displays (800x480 for Inky Impression 7.3")
		return buildDisplayResponse(
			`${basePngUrl}/${DEFAULT_SCREEN}.png?width=800&height=480`,
			`${DEFAULT_SCREEN}_${uniqueId}.png`,
			DEFAULT_REFRESH_RATE,
		);
	}

	logInfo("Display API Request", {
		source: "api/display",
		metadata: { headers },
	});

	try {
		const device = await findOrCreateDevice(headers);

		if (!device) {
			logError("Error fetching/creating device", {
				source: "api/display",
				metadata: { headers },
			});
			return buildErrorResponse("Device not found", baseBmpUrl, uniqueId);
		}

		let screenToDisplay = device.screen || DEFAULT_SCREEN;
		const orientation = device.screen_orientation || "landscape";
		const deviceWidth =
			orientation === "landscape"
				? device.screen_width || DEFAULT_IMAGE_WIDTH
				: device.screen_height || DEFAULT_IMAGE_HEIGHT;
		const deviceHeight =
			orientation === "landscape"
				? device.screen_height || DEFAULT_IMAGE_HEIGHT
				: device.screen_width || DEFAULT_IMAGE_WIDTH;
		const grayscaleLevels = getGrayscaleLevels(
			(device as { grayscale?: number | null }).grayscale ?? null,
		);
		const displayType =
			((device as { display_type?: string | null })
				.display_type as DeviceDisplayType) || DeviceDisplayType.BW;
		const isColorDisplay = displayType === DeviceDisplayType.COLOR;
		let dynamicRefreshRate = DEFAULT_REFRESH_RATE;
		let imageUrl: string;

		// Build image URL based on display type
		const buildImageUrl = (screen: string) => {
			if (isColorDisplay) {
				return `${basePngUrl}/${screen}.png?width=${deviceWidth}&height=${deviceHeight}`;
			}
			return `${baseBmpUrl}/${screen}.bmp?width=${deviceWidth}&height=${deviceHeight}&grayscale=${grayscaleLevels}`;
		};

		// Build filename with correct extension
		const buildFilename = (screen: string) =>
			`${screen}_${uniqueId}.${isColorDisplay ? "png" : "bmp"}`;

		switch (device.display_mode) {
			case DeviceDisplayMode.PLAYLIST:
				if (device.playlist_id) {
					const activeItem = await getActivePlaylistItem(
						device.playlist_id,
						device.current_playlist_index || 0,
						device.timezone || "UTC",
					);

					if (activeItem) {
						screenToDisplay = activeItem.screen_id;
						dynamicRefreshRate = activeItem.duration;
						// Update playlist index
						await db
							.updateTable("devices")
							.set({ current_playlist_index: activeItem.order_index })
							.where("id", "=", device.id.toString())
							.execute();
					} else {
						logInfo("No active playlist item found, using fallback", {
							source: "api/display",
							metadata: { deviceId: device.friendly_id },
						});
						screenToDisplay = device.screen || DEFAULT_SCREEN;
						dynamicRefreshRate = 60;
					}
				}
				imageUrl = buildImageUrl(screenToDisplay);
				break;

			case DeviceDisplayMode.MIXUP:
				if (device.mixup_id) {
					if (isColorDisplay) {
						imageUrl = `${baseBmpUrl}/mixup/${device.mixup_id}.bmp?width=${deviceWidth}&height=${deviceHeight}&grayscale=${grayscaleLevels}&format=png`;
					} else {
						imageUrl = `${baseBmpUrl}/mixup/${device.mixup_id}.bmp?width=${deviceWidth}&height=${deviceHeight}&grayscale=${grayscaleLevels}`;
					}
					const metadata = {
						deviceId: device.friendly_id,
						mixupId: device.mixup_id,
						displayType,
					};
					logInfo("Using mixup display mode", {
						source: "api/display",
						metadata,
					});
				} else {
					imageUrl = buildImageUrl(screenToDisplay);
				}
				dynamicRefreshRate = calculateRefreshRate(
					device.refresh_schedule as unknown as RefreshSchedule,
					DEFAULT_REFRESH_RATE,
					device.timezone || "UTC",
				);
				break;

			default:
				dynamicRefreshRate = calculateRefreshRate(
					device.refresh_schedule as unknown as RefreshSchedule,
					DEFAULT_REFRESH_RATE,
					device.timezone || "UTC",
				);
				imageUrl = buildImageUrl(screenToDisplay);
				break;
		}

		precacheImageInBackground(imageUrl, device.friendly_id);

		// Update device status in background
		updateDeviceStatus(device, headers, dynamicRefreshRate);
		const metadata = {
			deviceId: device.friendly_id,
			screen: screenToDisplay,
			refreshRate: dynamicRefreshRate,
			displayMode: device.display_mode,
		};
		logInfo("Display request successful", { source: "api/display", metadata });

		return buildDisplayResponse(
			imageUrl,
			buildFilename(screenToDisplay),
			dynamicRefreshRate,
		);
	} catch (_error) {
		logError("Internal server error", {
			source: "api/display",
			metadata: { headers },
		});
		return buildErrorResponse("Internal server error", baseBmpUrl, uniqueId);
	}
}
