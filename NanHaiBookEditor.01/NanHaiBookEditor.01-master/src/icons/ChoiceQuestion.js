import React from "react";

const SVGIcon = ({
	style = {},
	stroke = "#333333",
	fill = "none",
  width = "100%",
  height=36,
	className = "",
	viewBox = "0 0 64 64" // changing viewbox may causing issues
}) => (
	
    <svg t="1564644244949" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1151" width={width} height={height}><path d="M89.6 934.4H563.2a38.4 38.4 0 1 1 0 76.8H51.2A38.4 38.4 0 0 1 12.8 972.8V51.2A38.4 38.4 0 0 1 51.2 12.8h819.2a38.4 38.4 0 0 1 38.4 38.4v588.8a38.4 38.4 0 1 1-76.8 0V89.6H89.6v844.8zM204.8 320a38.4 38.4 0 0 1 0-76.8h512a38.4 38.4 0 1 1 0 76.8H204.8z m0 256a38.4 38.4 0 1 1 0-76.8h512a38.4 38.4 0 1 1 0 76.8H204.8z m535.0912 318.4128l204.8-204.8a38.4 38.4 0 0 1 54.272 54.3232l-231.936 231.936a38.4 38.4 0 0 1-54.272 0l-125.4912-125.4912a38.4 38.4 0 0 1 54.272-54.3232l98.3552 98.3552z" p-id="1152"></path></svg>

);

export default SVGIcon;


