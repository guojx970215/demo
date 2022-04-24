import React from "react";

const SVGIcon = ({
	style = {},
	stroke = "#333333",
	fill = "none",
	width = "100%",
	className = "",
	viewBox = "0 0 64 64" // changing viewbox may causing issues
}) => (
	<svg
		width={width}
		style={style}
		height={width}
		viewBox={viewBox}
		xmlns="http://www.w3.org/2000/svg"
		className={`svg-icon ${className || ""}`}
		xmlnsXlink="http://www.w3.org/1999/xlink"
	>
		<g>
			<g>
				<path
					fill={fill}
					stroke={stroke}
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeMiterlimit="10"
					d="
			M16.2,54.1h31.5c0.6,0,1-0.5,1-1V20.9l-11-11H16.2c-0.6,0-1,0.5-1,1v42.2C15.2,53.6,15.7,54.1,16.2,54.1z"
				/>
				<path
					fill={fill}
					stroke={stroke}
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeMiterlimit="10"
					d="
			M38.8,20.9h10l-11-11v10C37.8,20.4,38.2,20.9,38.8,20.9z"
				/>
			</g>

			<line
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				x1="21"
				y1="27"
				x2="43"
				y2="27"
			/>

			<line
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				x1="21"
				y1="32"
				x2="43"
				y2="32"
			/>

			<line
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				x1="21"
				y1="37"
				x2="43"
				y2="37"
			/>

			<line
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				x1="21"
				y1="42"
				x2="34"
				y2="42"
			/>
		</g>
	</svg>
);

export default SVGIcon;
