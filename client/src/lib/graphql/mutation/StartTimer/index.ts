import { gql } from "apollo-boost";

export const START_TIMER = gql`
  mutation startTimer($start: Float!, $id: ID!) {
    startTimer(start: $start, id: $id) {
      id
      title
      project {
        id
        title
        description
      }
      type
      notes
      start
      end
      isRunning
    }
  }
`;
