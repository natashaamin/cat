import React from "react";
import "./ListItemComponent.css";
import LoadingOverlay from "react-loading-overlay-ts";

interface listItemProps {
  name: string;
  weight: string;
  lifeSpan: string;
  imgUrl: string;
  loading: boolean;
}

const ListItemComponent = (props: listItemProps) => {
  const { name, weight, lifeSpan, imgUrl, loading } = props;

  return (
    <div className="list-item-container">
      <div className="left">
        <LoadingOverlay active={loading} spinner text="Loading...">
          <img src={imgUrl} className="thumbnail" />{" "}
        </LoadingOverlay>
      </div>
      <div className="center">
        <h4>Name: {name}</h4>
        <p>Weight: {weight}</p>
        <p>Lifespan: {lifeSpan}</p>
      </div>
      <div className="right">
        <p>&#8250;</p>
      </div>
    </div>
  );
};
export default ListItemComponent;
