import React from "react";

const ButtonComponent = (props: { url: string; label: string }) => {
  return (
    <div className="news-cta">
      <a href={props.url} target="_blank" className="button">
        {props.label}
      </a>
    </div>
  );
};

export default ButtonComponent;
