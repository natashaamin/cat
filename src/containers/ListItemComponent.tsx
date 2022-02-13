import { number } from "fp-ts";
import React from "react";
import "./ListItemComponent.css";

interface listItemProps {
  name: string,
  weight: string,
  lifeSpan: string,
  imgUrl: string,
}

const ListItemComponent = (props: listItemProps) => {
  const { name, weight, lifeSpan, imgUrl } = props;

  return (
    <div className="list-item-container">
      <div className="left">
        <img src={imgUrl} className="thumbnail"

/>
      </div>
      <div className="center">
        <h4>{name}</h4>
        <p>{weight}</p>
        <p>{lifeSpan}</p>
      </div>
      <div className="right">
        <p>&#8250;</p>
      </div>
    </div>
  );
}
export default ListItemComponent;