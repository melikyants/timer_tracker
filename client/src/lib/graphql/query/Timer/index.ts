
import { gql } from 'apollo-boost';

export const TIMERS = gql`
  query Timers {
    timers {
      id
      title
      type
      notes
      start
      end
      project_id
      project_title
      project_description
      isRunning
    }
  }
`;