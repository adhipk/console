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

/* Color cycle for ingredient bullets */
const BULLET_COLORS = [
	C.red,
	C.green,
	C.blue,
	C.orange,
	C.yellow,
	C.red,
	C.green,
	C.blue,
	C.orange,
	C.yellow,
];

/* ── SVG Icons ─────────────────────────────────────────────────────── */

function ChefHatIcon({ size = 28 }: { size?: number }) {
	return (
		<svg
			role="img"
			aria-label="Chef hat"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 32 32"
			width={size}
			height={size}
			fill="none"
		>
			{/* Hat puff */}
			<path
				d="M8 14 C4 14, 3 8, 8 6 C8 2, 14 0, 16 3 C18 0, 24 2, 24 6 C29 8, 28 14, 24 14"
				fill={C.white}
				stroke={C.red}
				strokeWidth="1.5"
			/>
			{/* Hat band */}
			<rect x="8" y="14" width="16" height="4" rx="1" fill={C.red} />
			{/* Hat body */}
			<rect
				x="9"
				y="18"
				width="14"
				height="8"
				rx="1"
				fill={C.white}
				stroke={C.red}
				strokeWidth="1"
			/>
			{/* Band lines */}
			<line
				x1="12"
				y1="22"
				x2="20"
				y2="22"
				stroke={C.red}
				strokeWidth="0.8"
				opacity="0.4"
			/>
			<line
				x1="12"
				y1="24"
				x2="20"
				y2="24"
				stroke={C.red}
				strokeWidth="0.8"
				opacity="0.4"
			/>
		</svg>
	);
}

function ForkKnifeIcon({
	size = 20,
	color = C.black,
}: {
	size?: number;
	color?: string;
}) {
	return (
		<svg
			role="img"
			aria-label="Fork and knife"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
			stroke={color}
			strokeWidth="1.5"
			strokeLinecap="round"
		>
			{/* Fork */}
			<line x1="7" y1="3" x2="7" y2="21" />
			<line x1="5" y1="3" x2="5" y2="9" />
			<line x1="9" y1="3" x2="9" y2="9" />
			<path d="M5 9 Q5 12, 7 12 Q9 12, 9 9" />
			{/* Knife */}
			<line x1="17" y1="12" x2="17" y2="21" />
			<path d="M17 3 Q20 3, 20 8 Q20 12, 17 12" fill={color} opacity="0.3" />
			<path d="M17 3 Q20 3, 20 8 Q20 12, 17 12" />
		</svg>
	);
}

function SteamIcon({
	size = 20,
	color = C.orange,
}: {
	size?: number;
	color?: string;
}) {
	return (
		<svg
			role="img"
			aria-label="Steam"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			width={size}
			height={size}
			fill="none"
			stroke={color}
			strokeWidth="1.5"
			strokeLinecap="round"
		>
			<path d="M4 16 C4 10, 8 12, 8 6" />
			<path d="M10 16 C10 10, 14 12, 14 6" />
			<path d="M16 16 C16 10, 12 12, 12 8" opacity="0.5" />
		</svg>
	);
}

/* ── Prop Types ────────────────────────────────────────────────────── */

interface Ingredient {
	name: string;
	measure: string;
}

interface ColorCookingProps {
	mealName?: string;
	category?: string;
	area?: string;
	ingredients?: Ingredient[];
	instructions?: string;
	mealThumb?: string;
	recipeUrl?: string;
	qrCodeUrl?: string;
	date?: string;
	width?: number;
	height?: number;
}

/* ── Main Component ────────────────────────────────────────────────── */
export default function ColorCooking({
	mealName = "Classic Margherita Pizza",
	category = "Miscellaneous",
	area = "Italian",
	ingredients = [
		{ name: "Pizza dough", measure: "1 ball" },
		{ name: "San Marzano tomatoes", measure: "1 can" },
		{ name: "Fresh mozzarella", measure: "200g" },
		{ name: "Fresh basil", measure: "handful" },
		{ name: "Olive oil", measure: "2 tbsp" },
		{ name: "Salt", measure: "to taste" },
		{ name: "Garlic", measure: "2 cloves" },
		{ name: "Oregano", measure: "1 tsp" },
	],
	instructions = "Stretch dough into a circle on a floured surface. Spread crushed tomatoes evenly, leaving a border for the crust. Tear mozzarella and distribute over sauce. Bake at 250°C for 8-10 minutes.",
	mealThumb = "",
	qrCodeUrl = "",
	date = "SATURDAY, FEBRUARY 7",
	width = 800,
	height = 480,
}: ColorCookingProps) {
	// Truncate meal name if too long (for display)
	const displayName =
		mealName.length > 32 ? `${mealName.slice(0, 30)}...` : mealName;

	// Split ingredients into two columns
	const col1 = ingredients.slice(0, 5);
	const col2 = ingredients.slice(5, 10);

	// Truncate instructions for the footer
	const shortInstructions =
		instructions.length > 180
			? `${instructions.slice(0, 178)}...`
			: instructions;

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
				{/* ── Red accent bar ─────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						height: "5px",
						width: "100%",
						backgroundColor: C.red,
					}}
				/>

				{/* ── Main Content: Two columns ──────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						flex: 1,
					}}
				>
					{/* ── LEFT COLUMN: Recipe Details ─────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "440px",
							padding: "18px 24px 14px 24px",
						}}
					>
						{/* Header: Icon + Label + Date */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<ChefHatIcon size={24} />
								<span
									style={{
										fontSize: "10px",
										fontWeight: 700,
										color: C.red,
										letterSpacing: "2.5px",
										marginLeft: "8px",
									}}
								>
									RECIPE OF THE DAY
								</span>
							</div>
						</div>

						{/* Decorative divider */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								marginTop: "10px",
								height: "2px",
								width: "100%",
							}}
						>
							<div
								style={{
									flex: 1,
									backgroundColor: C.red,
									height: "2px",
								}}
							/>
							<div
								style={{
									flex: 1,
									backgroundColor: C.orange,
									height: "2px",
								}}
							/>
							<div
								style={{
									flex: 1,
									backgroundColor: C.yellow,
									height: "2px",
								}}
							/>
						</div>

						{/* Meal Name */}
						<span
							style={{
								fontSize: "34px",
								fontWeight: 700,
								color: C.black,
								lineHeight: 1.05,
								marginTop: "14px",
								letterSpacing: "-0.5px",
							}}
						>
							{displayName}
						</span>

						{/* Category + Area Badges */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								marginTop: "10px",
								alignItems: "center",
							}}
						>
							{/* Area badge */}
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: C.blue,
									padding: "3px 10px",
									marginRight: "8px",
								}}
							>
								<span
									style={{
										fontSize: "9px",
										fontWeight: 700,
										color: C.white,
										letterSpacing: "1.5px",
									}}
								>
									{area.toUpperCase()}
								</span>
							</div>
							{/* Category badge */}
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: C.green,
									padding: "3px 10px",
									marginRight: "8px",
								}}
							>
								<span
									style={{
										fontSize: "9px",
										fontWeight: 700,
										color: C.white,
										letterSpacing: "1.5px",
									}}
								>
									{category.toUpperCase()}
								</span>
							</div>
							{/* Decorative icon */}
							<SteamIcon size={16} color={C.orange} />
						</div>

						{/* INGREDIENTS section */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								marginTop: "16px",
							}}
						>
							<ForkKnifeIcon size={14} color={C.black} />
							<span
								style={{
									fontSize: "9px",
									fontWeight: 700,
									color: C.black,
									letterSpacing: "2px",
									marginLeft: "6px",
									opacity: 0.5,
								}}
							>
								INGREDIENTS
							</span>
							<div
								style={{
									display: "flex",
									flex: 1,
									height: "1px",
									backgroundColor: C.black,
									marginLeft: "10px",
									opacity: 0.15,
								}}
							/>
						</div>

						{/* Ingredient columns */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								marginTop: "8px",
								flex: 1,
							}}
						>
							{/* Column 1 */}
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									flex: 1,
								}}
							>
								{col1.map((ing, i) => (
									<div
										key={`c1-${i}`}
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											marginBottom: "5px",
										}}
									>
										<div
											style={{
												width: "7px",
												height: "7px",
												backgroundColor: BULLET_COLORS[i],
												flexShrink: 0,
												marginRight: "8px",
											}}
										/>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
											}}
										>
											<span
												style={{
													fontSize: "11px",
													fontWeight: 600,
													color: C.black,
													lineHeight: 1.2,
												}}
											>
												{ing.name}
											</span>
											{ing.measure && (
												<span
													style={{
														fontSize: "8px",
														color: C.black,
														opacity: 0.45,
														lineHeight: 1.1,
													}}
												>
													{ing.measure}
												</span>
											)}
										</div>
									</div>
								))}
							</div>

							{/* Column 2 */}
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									flex: 1,
								}}
							>
								{col2.map((ing, i) => (
									<div
										key={`c2-${i}`}
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											marginBottom: "5px",
										}}
									>
										<div
											style={{
												width: "7px",
												height: "7px",
												backgroundColor: BULLET_COLORS[i + 5],
												flexShrink: 0,
												marginRight: "8px",
											}}
										/>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
											}}
										>
											<span
												style={{
													fontSize: "11px",
													fontWeight: 600,
													color: C.black,
													lineHeight: 1.2,
												}}
											>
												{ing.name}
											</span>
											{ing.measure && (
												<span
													style={{
														fontSize: "8px",
														color: C.black,
														opacity: 0.45,
														lineHeight: 1.1,
													}}
												>
													{ing.measure}
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* ── RIGHT COLUMN: Image + QR ────────────────────── */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
							padding: "18px 24px 14px 0",
							alignItems: "center",
						}}
					>
						{/* Meal Thumbnail */}
						{mealThumb ? (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									width: "100%",
								}}
							>
								<div
									style={{
										display: "flex",
										border: `3px solid ${C.red}`,
										overflow: "hidden",
									}}
								>
									<img
										src={mealThumb}
										alt={mealName}
										width={290}
										height={175}
										style={{
											objectFit: "cover",
										}}
									/>
								</div>
								{/* Image caption strip */}
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										width: "296px",
										height: "4px",
									}}
								>
									<div style={{ flex: 1, backgroundColor: C.red }} />
									<div style={{ flex: 1, backgroundColor: C.orange }} />
									<div style={{ flex: 1, backgroundColor: C.yellow }} />
									<div style={{ flex: 1, backgroundColor: C.green }} />
									<div style={{ flex: 1, backgroundColor: C.blue }} />
								</div>
							</div>
						) : (
							/* Placeholder when no image */
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									width: "290px",
									height: "175px",
									backgroundColor: C.yellow,
									border: `3px solid ${C.orange}`,
								}}
							>
								<ChefHatIcon size={64} />
								<span
									style={{
										fontSize: "11px",
										fontWeight: 700,
										color: C.red,
										letterSpacing: "2px",
										marginTop: "8px",
									}}
								>
									BON APPÉTIT
								</span>
							</div>
						)}

						{/* QR Code Section */}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								marginTop: "auto",
								paddingTop: "10px",
							}}
						>
							{qrCodeUrl ? (
								<div
									style={{
										display: "flex",
										border: `2px solid ${C.black}`,
										padding: "4px",
										backgroundColor: C.white,
									}}
								>
									<img src={qrCodeUrl} alt="QR Code" width={90} height={90} />
								</div>
							) : (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: "98px",
										height: "98px",
										border: `2px solid ${C.black}`,
										backgroundColor: C.white,
									}}
								>
									<ForkKnifeIcon size={40} color={C.black} />
								</div>
							)}

							<div
								style={{
									display: "flex",
									flexDirection: "column",
									marginLeft: "14px",
								}}
							>
								<span
									style={{
										fontSize: "10px",
										fontWeight: 700,
										color: C.black,
										letterSpacing: "2px",
									}}
								>
									SCAN FOR
								</span>
								<span
									style={{
										fontSize: "13px",
										fontWeight: 700,
										color: C.red,
										letterSpacing: "1px",
										marginTop: "2px",
									}}
								>
									FULL RECIPE
								</span>
								<div
									style={{
										display: "flex",
										width: "40px",
										height: "2px",
										backgroundColor: C.orange,
										marginTop: "6px",
									}}
								/>
								<span
									style={{
										fontSize: "8px",
										color: C.black,
										opacity: 0.4,
										marginTop: "6px",
										letterSpacing: "0.5px",
									}}
								>
									THEMEALDB.COM
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* ── Footer: Instruction snippet ────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						padding: "10px 24px",
						borderTop: `2.5px solid ${C.black}`,
					}}
				>
					{/* Orange accent bar */}
					<div
						style={{
							width: "4px",
							height: "34px",
							backgroundColor: C.orange,
							marginRight: "14px",
							flexShrink: 0,
						}}
					/>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
						}}
					>
						<span
							style={{
								fontSize: "8px",
								fontWeight: 700,
								color: C.black,
								letterSpacing: "1.5px",
								opacity: 0.35,
								marginBottom: "3px",
							}}
						>
							INSTRUCTIONS
						</span>
						<span
							style={{
								fontSize: "10.5px",
								color: C.black,
								fontStyle: "italic",
								lineHeight: 1.35,
							}}
						>
							&ldquo;{shortInstructions}&rdquo;
						</span>
					</div>

					{/* Date */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
							marginLeft: "16px",
							flexShrink: 0,
						}}
					>
						<span
							style={{
								fontSize: "8px",
								fontWeight: 700,
								color: C.red,
								letterSpacing: "1px",
							}}
						>
							{date}
						</span>
					</div>
				</div>

				{/* ── Bottom color bar ────────────────────────────────── */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						height: "4px",
						width: "100%",
					}}
				>
					<div style={{ flex: 2, backgroundColor: C.red }} />
					<div style={{ flex: 2, backgroundColor: C.orange }} />
					<div style={{ flex: 1, backgroundColor: C.yellow }} />
					<div style={{ flex: 1, backgroundColor: C.green }} />
					<div style={{ flex: 1, backgroundColor: C.blue }} />
				</div>
			</div>
		</PreSatori>
	);
}
