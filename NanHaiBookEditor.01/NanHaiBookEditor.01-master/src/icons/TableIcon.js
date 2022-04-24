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
			<polygon
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				points="56,38 8,38 14,14 50,14"
			/>

			<line
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				x1="32"
				y1="14"
				x2="32"
				y2="38"
			/>

			<line
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				x1="22.8"
				y1="14.4"
				x2="19.2"
				y2="38.4"
			/>

			<line
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				x1="41.2"
				y1="14.4"
				x2="44.8"
				y2="38.4"
			/>

			<line
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				x1="13"
				y1="20"
				x2="51"
				y2="20"
			/>

			<line
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				x1="12"
				y1="26"
				x2="52"
				y2="26"
			/>

			<line
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				x1="10"
				y1="32"
				x2="54"
				y2="32"
			/>

			<rect
				x="28"
				y="38"
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				width="8"
				height="9"
			/>

			<rect
				x="22"
				y="47"
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				width="21"
				height="3"
			/>
		</g>
	</svg>
);

export default SVGIcon;
