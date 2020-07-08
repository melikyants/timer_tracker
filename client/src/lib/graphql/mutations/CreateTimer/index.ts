import { gql } from "apollo-boost";

export const CREATE_TIMER = gql`
  mutation createTimer($start: Float!, $title: String!) {
    createTimer(start: $start, title: $title) {
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
