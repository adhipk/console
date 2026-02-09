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

type GooglePhotosProps = {
	title?: string;
	photoUrl?: string;
	albumHost?: string;
	albumUrl?: string;
	updatedAt?: string;
	status?: "ok" | "no_album_url" | "invalid_url" | "fetch_failed" | "no_images";
	error?: string;
	width?: number;
	height?: number;
};

function statusLabel(status: GooglePhotosProps["status"]): string {
	switch (status) {
		case "ok":
			return "LIVE";
		case "no_album_url":
			return "MISSING ALBUM URL";
		case "invalid_url":
			return "INVALID ALBUM URL";
		case "fetch_failed":
			return "FETCH FAILED";
		case "no_images":
			return "NO IMAGES FOUND";
		default:
			return "UNAVAILABLE";
	}
}

export default function ColorGooglePhotos({
	title = "Google Photos",
	photoUrl = "",
	albumHost = "photos.google.com",
	albumUrl = "",
	updatedAt = "",
	status = "no_album_url",
	error = "",
	width = 800,
	height = 480,
}: GooglePhotosProps) {
	const hasImage = Boolean(photoUrl && status === "ok");

	return (
		<PreSatori width={width} height={height}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					backgroundColor: C.white,
				}}
			>
				{/* Top accent rule */}
				<div
					style={{
						display: "flex",
						height: "6px",
						width: "100%",
						backgroundColor: C.blue,
					}}
				/>

				{/* Header */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "baseline",
						justifyContent: "space-between",
						padding: "14px 20px 8px 20px",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<span
							style={{
								fontSize: "10px",
								fontWeight: 700,
								letterSpacing: "2px",
								color: C.blue,
							}}
						>
							COLOR PHOTO FEED
						</span>
						<span
							style={{
								fontSize: "36px",
								fontWeight: 700,
								color: C.black,
								lineHeight: 1.05,
								marginTop: "2px",
							}}
						>
							{title}
						</span>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: hasImage ? C.green : C.red,
							padding: "4px 10px",
						}}
					>
						<span
							style={{
								fontSize: "11px",
								fontWeight: 700,
								color: C.white,
								letterSpacing: "1px",
							}}
						>
							{statusLabel(status)}
						</span>
					</div>
				</div>

				{/* Meta row */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "0 20px 8px 20px",
						borderBottom: `2px solid ${C.black}`,
					}}
				>
					<span
						style={{
							fontSize: "13px",
							fontWeight: 600,
							color: C.black,
						}}
					>
						Source: {albumHost}
					</span>
					<span
						style={{
							fontSize: "11px",
							fontWeight: 500,
							color: C.black,
							opacity: 0.75,
						}}
					>
						Updated: {updatedAt || "N/A"}
					</span>
				</div>

				{/* Photo panel */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						padding: "12px 20px",
					}}
				>
					{hasImage ? (
						<div
							style={{
								display: "flex",
								flex: 1,
								border: `3px solid ${C.black}`,
								overflow: "hidden",
							}}
						>
							<img
								src={photoUrl}
								alt={title}
								width={760}
								height={330}
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
								}}
							/>
						</div>
					) : (
						<div
							style={{
								display: "flex",
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "column",
								border: `3px solid ${C.black}`,
								backgroundColor: "#F6F6F6",
								padding: "24px",
							}}
						>
							<span
								style={{
									fontSize: "28px",
									fontWeight: 700,
									color: C.black,
									textAlign: "center",
									lineHeight: 1.15,
								}}
							>
								{statusLabel(status)}
							</span>
							<span
								style={{
									fontSize: "15px",
									fontWeight: 500,
									color: C.black,
									opacity: 0.7,
									marginTop: "8px",
									textAlign: "center",
								}}
							>
								Provide a Google Photos shared album URL in settings.
							</span>
							{error && (
								<span
									style={{
										fontSize: "12px",
										fontWeight: 500,
										color: C.red,
										marginTop: "12px",
										textAlign: "center",
									}}
								>
									{error}
								</span>
							)}
						</div>
					)}
				</div>

				{/* Footer */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "8px 20px 10px 20px",
						borderTop: `2px solid ${C.black}`,
					}}
				>
					<span
						style={{
							fontSize: "10px",
							fontWeight: 600,
							letterSpacing: "1px",
							color: C.black,
							opacity: 0.55,
						}}
					>
						GOOGLE PHOTOS SHARED ALBUM
					</span>
					<span
						style={{
							fontSize: "10px",
							fontWeight: 500,
							color: C.black,
							opacity: 0.55,
							maxWidth: "460px",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{albumUrl || "Set albumUrl in recipe settings"}
					</span>
				</div>
			</div>
		</PreSatori>
	);
}
