import { gql } from "@apollo/client";

export const TIMER = gql`
  query Timer($id: ID!) {
    timer(id: $id) {
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
