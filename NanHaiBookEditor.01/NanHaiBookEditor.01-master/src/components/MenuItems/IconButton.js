import React from "react";
import "./IconButton.css";

const IconButton = ({ children, text, onClickCallback }) => {
	return (
		<div className="stdMenuItemOuter" onClick={onClickCallback}>
			<div className="stdMenuItem">
				<span className="stdMenuIcon">{children}</span>
				<span>{text}</span>
			</div>
		</div>
	);
};

export default IconButton;
