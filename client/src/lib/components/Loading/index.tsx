import React from "react";
import styled, { keyframes } from "styled-components";

interface ILoading {
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
}

export const Loading = () => {
  return (
    <StyledLoading>
      <span />
      <span />
      <span />
      <span />
    </StyledLoading>
  );
};
const spin = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const spinOpacity = keyframes`
  to {
    opacity: 1;
  }
`;
const StyledLoading = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
  animation: 1.2s ${spin} linear infinite;
  left: 50%;
  top: 50%;
  position: absolute;
  z-index: 1;
  & > span {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: red;
    display: block;
    position: absolute;
    opacity: 0.3;
    animation: 1s ${spinOpacity} linear infinite alternate;
    transform-origin: 50% 50%;
    opacity: 0.3;
    &:nth-child(1) {
      left: 0;
      top: 0;
    }
    &:nth-child(2) {
      right: 0;
      top: 0;
      animation-delay: 0.4s;
    }
    &:nth-child(3) {
      right: 0;
      bottom: 0;
      animation-delay: 0.8s;
    }
    &:nth-child(4) {
      left: 0;
      bottom: 0;
      animation-delay: 1.2s;
    }
  }
`;

StyledLoading.defaultProps = {
  theme: {
    fontFamily: "Roboto Condensed, sans serif",
    borderColor: "#e6e6e6",
    borderRadius: "6px",
    color: "hsl(0, 0%, 12%)",
    colorSecondary: "hsl(0, 0%, 42%)",
  },
};
