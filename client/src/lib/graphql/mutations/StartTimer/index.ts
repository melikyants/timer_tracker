import { gql } from "@apollo/client";

export const START_TIMER = gql`
  mutation startTimer($start: Float!, $id: ID!) {
    startTimer(start: $start, id: $id) {
      id
      title
      start
      isRunning
    }
  }
`;
