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
			<path
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				d="
		M50.4,14H13.7c-1,0-2.7,0.9-2.7,2v20.1v4.6v7.5c0,1.6,2.3,2.2,3.6,1.1l8.4-7.3h27.5c1,0,1.6-0.3,1.6-1.3V16
		C52,14.9,51.5,14,50.4,14z"
			/>
			<g>
				<line
					fill={fill}
					stroke={stroke}
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeMiterlimit="10"
					x1="21"
					y1="23"
					x2="43"
					y2="23"
				/>

				<line
					fill={fill}
					stroke={stroke}
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeMiterlimit="10"
					x1="21"
					y1="28"
					x2="43"
					y2="28"
				/>

				<line
					fill={fill}
					stroke={stroke}
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeMiterlimit="10"
					x1="21"
					y1="33"
					x2="43"
					y2="33"
				/>
			</g>
		</g>
	</svg>
);

export default SVGIcon;