import { gql } from "apollo-boost";

export const STOP_TIMER = gql`
  mutation stopTimer($id: ID!, $end: Float!) {
    stopTimer(id: $id, end: $end) {
      id
      title
      type
      notes
      start
      end
      project {
        id
        title
        description
      }
      isRunning
    }
  }
`;
