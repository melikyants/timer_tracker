import { gql } from "@apollo/client";

export const CREATE_TIMER = gql`
  mutation createTimer($start: Float!, $title: String!) {
    createTimer(start: $start, title: $title) {
      id
      title
      start
      isRunning
    }
  }
`;
