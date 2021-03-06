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
    <path fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="
		M24.3,49.6l-12.7,3.9c-0.7,0.2-1.4-0.4-1.2-1.2l3.9-12.7l24.5-24.5l10,10L24.3,49.6z"/>
	
		<rect x="35.3" y="19.6" transform="matrix(0.7071 0.7071 -0.7071 0.7071 27.7288 -23.5666)" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" width="14.1" height="4.3"/>
	<path fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="
		M24.3,49.6l0.3-4.3c0-0.6-0.4-1-1-1l-3.2,0.2c-0.6,0-1-0.4-1-1l0.2-3.2c0-0.6-0.4-1-1-1l-4.3,0.3l21.5-21.5l10,10L24.3,49.6z"/>
	
		<line fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="40.9" y1="23.1" x2="19.9" y2="44.1"/>
	
		<line fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="16.3" y1="37.8" x2="35.9" y2="18.2"/>
	
		<line fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="38.4" y1="20.6" x2="19.4" y2="39.6"/>
	
		<line fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="45.8" y1="28.1" x2="26.2" y2="47.7"/>
	
		<line fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="24.4" y1="44.6" x2="43.4" y2="25.6"/>
	
		<line fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="13.4" y1="46.4" x2="18.3" y2="51.4"/>
	<path fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="
		M51.5,12.5L51.5,12.5c-2.8-2.8-7.2-2.8-10,0l-2.7,2.7l10,10l2.7-2.7C54.2,19.7,54.2,15.3,51.5,12.5z"/>
		</g>
	</svg>
);

export default SVGIcon;
