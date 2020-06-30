
import { gql } from 'apollo-boost';

export const TIMER = gql`
  query Timer($id: ID!) {
    timer(id: $id) {
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