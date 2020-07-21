import React from "react";
import styled from "styled-components";

interface IInput {
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
  onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input = (props: IInput) => {
  const {
    bind,
    placeholder,
    type,
    id,
    name,
    disabled,
    required,
    onKeyDown,
  }: IInput = props;
  return (
    <InputText
      type={type}
      placeholder={placeholder}
      id={id}
      name={name}
      disabled={disabled}
      required={required}
      {...bind}
      onKeyDown={onKeyDown}
    />
  );
};

const InputText = styled.input`
  font-family: ${(props) => props.theme.fontFamily};
  border-radius: ${(props) => props.theme.borderRadius};
  border: 1px solid ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.color};
  height: 32px;
  width: 100%;
  padding: 0 12px;

  &::placeholder {
    color: ${(props) => props.theme.colorSecondary};
  }
`;

InputText.defaultProps = {
  theme: {
    fontFamily: "Roboto Condensed, sans serif",
    borderColor: "#e6e6e6",
    borderRadius: "6px",
    color: "hsl(0, 0%, 12%)",
    colorSecondary: "hsl(0, 0%, 42%)",
  },
};
