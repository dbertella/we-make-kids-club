import React from "react";
import ReactIcon from "./icon";

type LinkProps = {
  title: string;
  link: string;
  icon: string;
  handle: string;
  withHandle?: boolean;
};
function IconLink({ title, link, icon, handle, withHandle }: LinkProps) {
  return (
    <a
      href={link}
      target="_blank"
      aria-label={`Go to ${title}`}
      className="icon-link"
    >
      <span className="sr-only">{title}</span>
      <ReactIcon iconName={icon} />
      {withHandle && <span>{handle}</span>}
    </a>
  );
}

export default IconLink;
