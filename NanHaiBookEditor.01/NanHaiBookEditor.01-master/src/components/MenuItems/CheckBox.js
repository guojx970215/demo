import React from 'react';
import "./CheckBox.css";

const CheckBox = ({children,checked,text,onClickCallback}) => {
  return (
    <div className="stdMenuItemOuter">
      <div className="stdMenuItem" onClick={onClickCallback}>
        {/*<input type="checkbox" checked={checked} onChange={onClickCallback}/>*/}
        <span className="stdMenuIcon">{children}</span>
        <span>{text}</span>
      </div>
    </div>
  )
}

export default CheckBox;