import React from "react";
import styled from "styled-components";

interface ITextarea {
  name: string;
  placeholder: string;
  rows?: number;
  bind: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  };
  disabled?: boolean;
}
export const Textarea = ({
  name,
  placeholder,
  rows,
  bind,
  disabled,
}: ITextarea) => {
  return (
    <StyledTextarea
      name={name}
      placeholder={placeholder}
      rows={rows}
      {...bind}
      disabled={disabled}
    />
  );
};

const StyledTextarea = styled.textarea`
  width: 100%;
  resize: none;
  border-radius: 12px;
  background: $mainBg;
  border: 0;
  border: 1px solid ${(props) => props.theme.borderColor};
  padding: 12px;
  color: ${(props) => props.theme.color};
  font-family: ${(props) => props.theme.fontFamily};

  &::placeholder {
    color: ${(props) => props.theme.colorSecondary};
  }
`;

StyledTextarea.defaultProps = {
  theme: {
    fontFamily: "Roboto Condensed, sans serif",
    borderColor: "#e6e6e6",
    borderRadius: "6px",
    color: "hsl(0, 0%, 12%)",
    colorSecondary: "hsl(0, 0%, 42%)",
  },
};
