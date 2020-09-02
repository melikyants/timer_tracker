import React from "react";
import "./button.scss";

import { ReactComponent as DeleteIcon } from "./assets/delete.svg";
import { ReactComponent as PlayIcon } from "./assets/play.svg";
import { ReactComponent as StopIcon } from "./assets/stop.svg";
import { ReactComponent as EditIcon } from "./assets/edit.svg";
import { ReactComponent as MoreIcon } from "./assets/arrowDown.svg";

// enum Icons {
//   delete = "delete",
//   arrow = "arrow",
// }
//icon: keyof typeof Icons
type Icons = "delete" | "play" | "stop" | "edit" | "more" | "loading";

interface IButton {
  text?: string;
  icon?: Icons;
  onClick?: () => void;
  simpleIcon?: boolean;
  timerActions?: boolean;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
}

const iconName = (icon: Icons) => {
  switch (icon) {
    case "delete":
      return <DeleteIcon />;
    case "play":
      return <PlayIcon />;
    case "stop":
      return <StopIcon />;
    case "edit":
      return <EditIcon />;
    case "more":
      return <MoreIcon />;
    case "loading":
      return (
        <div className="btn-icon-loader">
          <span />
          <span />
          <span />
          <span />
        </div>
      );
  }
};

export const Button = React.forwardRef<HTMLButtonElement, IButton>(
  ({ text, icon, onClick, simpleIcon, timerActions, type, disabled }, ref) => {
    let btnClassNames = simpleIcon
      ? `btn-icon-simple btn-icon-simple--${icon}`
      : `btn-icon btn-icon--${icon}`;
    btnClassNames = timerActions
      ? `btn-actions btn-actions--${icon}`
      : btnClassNames;

    return (
      <>
        {icon && (
          <button
            className={`${btnClassNames}`}
            onClick={onClick}
            disabled={disabled}
          >
            {iconName(icon)}
          </button>
        )}
      </>
    );
  }
);
