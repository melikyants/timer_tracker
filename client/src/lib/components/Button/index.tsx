import React from "react";
import styled from "styled-components";

import { ReactComponent as DeleteIcon } from "./assets/delete.svg";
import { ReactComponent as ArrowIcon } from "./assets/arrow.svg";
import { ReactComponent as StopIcon } from "./assets/stop.svg";

// enum Icons {
//   delete = "delete",
//   arrow = "arrow",
// }
//icon: keyof typeof Icons
type Icons = "delete" | "arrow" | "stop";

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
    case "arrow":
      return <ArrowIcon />;
    case "stop":
      return <StopIcon />;
  }
};
const iconColor = (icon: Icons) => {
  switch (icon) {
    case "delete":
      return "#c31818";
    case "arrow":
      return "black";
    case "stop":
      return "#c31818";
  }
};
export const Button = React.forwardRef<HTMLButtonElement, IButton>(
  ({ text, icon, onClick, simpleIcon, type }, ref) => {
    const isSimpleIcon = simpleIcon ? true : false;
    return (
      <>
        {icon ? (
          <ButtonStyledIcon
            onClick={onClick}
            iconColor={icon}
            simpleIcon={isSimpleIcon}
          >
            {iconName(icon)}
          </ButtonStyledIcon>
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
  background-color: $mainBg;
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

const ButtonStyledIcon = styled(ButtonStyled)<{
  iconColor: Icons;
  simpleIcon: boolean;
}>`
  background: transparent;
  box-shadow: none;
  border-radius: 32px;
  width: ${(props) => (props.simpleIcon ? "16px" : "32px")};
  height: ${(props) => (props.simpleIcon ? "16px" : "32px")};
  box-shadow: ${(props) =>
    !props.simpleIcon
      ? "4px 4px 8px 0px hsl(0, 0%, 95%),-4px -4px 8px 0px hsl(0, 0%, 100%)"
      : "none"};
  cursor: pointer;
  transition: box-shadow 0.3s linear;

  & svg {
    width: 16px;
    height: 16px;
    fill: ${(props) => iconColor(props.iconColor)};
    // stroke: $fontColorMain;
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