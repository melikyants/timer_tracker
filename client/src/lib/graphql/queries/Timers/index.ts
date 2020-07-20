import { gql } from "apollo-boost";

export const TIMERS = gql`
  query Timers($pageSize: Int, $after: String) {
    timers(pageSize: $pageSize, after: $after) {
      cursor
      hasMore
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
  }
`;
