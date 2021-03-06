import { gql } from "@apollo/client";

export const UPDATE_TIMER = gql`
  mutation updateTimer(
    $id: ID!
    $title: String
    $start: Float
    $end: Float
    $project_id: String
    $project_description: String
    $notes: String
    $type: TimerType
  ) {
    updateTimer(
      id: $id
      title: $title
      start: $start
      end: $end
      project_id: $project_id
      project_description: $project_description
      notes: $notes
      type: $type
    ) {
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
