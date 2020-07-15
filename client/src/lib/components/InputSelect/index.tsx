import React from "react";
import styled from "styled-components";
import { ReactComponent as ArrowIcon } from "./assets/arrow.svg";

interface inputSelect {
  bind: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  placeholder: string;
  type: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;

  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const InputSelect = React.forwardRef<HTMLDivElement, inputSelect>(
  (props, ref) => {
    const {
      bind,
      placeholder,
      type,
      id,
      name,
      disabled,
      required,
      onClick,
    }: inputSelect = props;
    return (
      <InputSelectDropDown>
        <input
          type={type}
          placeholder={placeholder}
          id={id}
          name={name}
          disabled={disabled}
          required={required}
          autoComplete="off"
          {...bind}
        />
        <div ref={ref} onClick={onClick}>
          <ArrowIcon />
        </div>
      </InputSelectDropDown>
    );
  }
);

const InputSelectDropDown = styled.div`
  font-family: ${(props) => props.theme.fontFamily};
  border-radius: ${(props) => props.theme.borderRadius};
  border: 1px solid ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.color};
  height: 32px;
  width: 100%;
  padding: 0 6px 0 12px;
  display: flex;
  align-items: center;

  &::placeholder {
    color: ${(props) => props.theme.colorSecondary};
  }
  & input {
    border: 0;
    height: 32px;
    background: transparent;
    padding: 0;
  }

  & svg {
    width: 12px;
    height: 12px;
    transform: rotate(90deg);
    cursor: pointer;
  }
`;

InputSelectDropDown.defaultProps = {
  theme: {
    fontFamily: "Roboto Condensed, sans serif",
    borderColor: "#e6e6e6",
    borderRadius: "6px",
    color: "hsl(0, 0%, 12%)",
    colorSecondary: "hsl(0, 0%, 42%)",
  },
};
