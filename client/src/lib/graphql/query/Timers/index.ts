import { gql } from "apollo-boost";

export const TIMERS = gql`
  query Timers {
    timers {
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
