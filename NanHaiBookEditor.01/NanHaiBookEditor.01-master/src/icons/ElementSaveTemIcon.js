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
		t="1578723652019"
		className="icon"
		viewBox="0 0 1024 1024"
		// viewBox={viewBox}
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		p-id="2099"
		width="16"
		height="16">
		<path d="M947.2 179.2l-128-128c-32-32-89.6-51.2-128-51.2H268.8c-44.8 0-83.2 38.4-83.2 83.2v153.6H256V83.2s0-6.4 6.4-6.4h435.2v230.4h224v640s0 6.4-6.4 6.4H262.4s-6.4 0-6.4-6.4v-57.6H185.6v57.6c0 44.8 38.4 76.8 76.8 76.8h659.2c44.8 0 76.8-38.4 76.8-76.8V332.8c0-38.4-19.2-121.6-51.2-153.6z m-172.8-70.4L896 230.4h-121.6V108.8z" p-id="2100"></path>
		<path d="M620.8 537.6h249.6v83.2H620.8zM620.8 672h249.6v83.2H620.8zM620.8 403.2h249.6v83.2H620.8zM403.2 332.8H96C57.6 332.8 19.2 364.8 19.2 409.6v307.2c0 38.4 32 76.8 76.8 76.8h307.2c38.4 0 76.8-32 76.8-76.8V409.6c0-44.8-32-76.8-76.8-76.8z m-224 57.6h153.6v115.2H179.2V390.4z m243.2 326.4c0 12.8-6.4 19.2-19.2 19.2H96c-12.8 0-19.2-6.4-19.2-19.2V409.6c0-12.8 6.4-19.2 19.2-19.2h25.6v172.8H384V390.4h25.6c12.8 0 19.2 6.4 19.2 19.2v307.2z" p-id="2101"></path>
	</svg>
  // <svg 
	// 	className={`svg-icon ${className || ""}`}
	// 	viewBox={viewBox}
  //   xmlns="http://www.w3.org/2000/svg"
	// 	xmlnsXlink="http://www.w3.org/1999/xlink"
	// 	width={width}
	// 	height={width}
	// 	style={style}>
  //   <path d="M947.2 179.2l-128-128c-32-32-89.6-51.2-128-51.2H268.8c-44.8 0-83.2 38.4-83.2 83.2v153.6H256V83.2s0-6.4 6.4-6.4h435.2v230.4h224v640s0 6.4-6.4 6.4H262.4s-6.4 0-6.4-6.4v-57.6H185.6v57.6c0 44.8 38.4 76.8 76.8 76.8h659.2c44.8 0 76.8-38.4 76.8-76.8V332.8c0-38.4-19.2-121.6-51.2-153.6z m-172.8-70.4L896 230.4h-121.6V108.8z" p-id="2100"></path>
  //   <path d="M620.8 537.6h249.6v83.2H620.8zM620.8 672h249.6v83.2H620.8zM620.8 403.2h249.6v83.2H620.8zM403.2 332.8H96C57.6 332.8 19.2 364.8 19.2 409.6v307.2c0 38.4 32 76.8 76.8 76.8h307.2c38.4 0 76.8-32 76.8-76.8V409.6c0-44.8-32-76.8-76.8-76.8z m-224 57.6h153.6v115.2H179.2V390.4z m243.2 326.4c0 12.8-6.4 19.2-19.2 19.2H96c-12.8 0-19.2-6.4-19.2-19.2V409.6c0-12.8 6.4-19.2 19.2-19.2h25.6v172.8H384V390.4h25.6c12.8 0 19.2 6.4 19.2 19.2v307.2z" p-id="2101"></path>
  // </svg>
);

export default SVGIcon;
