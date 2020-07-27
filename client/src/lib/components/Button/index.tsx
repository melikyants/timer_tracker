import React from "react";
import styled from "styled-components";
import "./button.scss";

import { ReactComponent as DeleteIcon } from "./assets/delete.svg";
import { ReactComponent as PlayIcon } from "./assets/play.svg";
import { ReactComponent as StopIcon } from "./assets/stop.svg";

// enum Icons {
//   delete = "delete",
//   arrow = "arrow",
// }
//icon: keyof typeof Icons
type Icons = "delete" | "play" | "stop";

interface IButton {
  text?: string;
  icon?: Icons;
  onClick: () => void;
  simpleIcon?: boolean;
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
  }
};

export const Button = React.forwardRef<HTMLButtonElement, IButton>(
  ({ text, icon, onClick, simpleIcon, type }, ref) => {
    // const isSimpleIcon = simpleIcon ? true : false;
    return (
      <>
        {icon ? (
          <button className={`btn-icon btn-icon--${icon}`} onClick={onClick}>
            {iconName(icon)}
          </button>
        ) : (
          <ButtonStyled ref={ref} type={type} onClick={onClick}>
            {text && text}
          </ButtonStyled>
        )}
      </>
    );
  }
);

const ButtonStyled = styled.button`
  font-family: ${(props) => props.theme.fontFamily};
  border-radius: ${(props) => props.theme.borderRadius};
  color: ${(props) => props.theme.color};

  height: 32px;
  width: 120px;
  border: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: $main-bg;
  box-shadow: 4px 4px 8px 0px $shaddow, -4px -4px 8px 0px $highlight;
  cursor: pointer;
  transition: box-shadow 0.3s linear;

  &:active,
  &:hover {
    box-shadow: inset 4px 4px 8px 0px $shaddow,
      inset -4px -4px 8px 0px $highlight;
    transition: box-shadow 0.3s linear;
  }
`;

ButtonStyled.defaultProps = {
  theme: {
    fontFamily: "Roboto Condensed, sans serif",
    borderColor: "#e6e6e6",
    borderRadius: "12px",
    color: "hsl(0, 0%, 12%)",
  },
};
