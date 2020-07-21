import { gql } from "@apollo/client";

export const STOP_TIMER = gql`
  mutation stopTimer($id: ID!, $end: Float!) {
    stopTimer(id: $id, end: $end) {
      id
      end
      isRunning
    }
  }
`;
