import { gql } from 'apollo-boost';

export const STOP_TIMER = gql`
mutation stopTimer($id: ID!, $end: Float!){
  stopTimer(id: $id, end: $end){
    id
    title
    project_id
    type
    notes
    start
    end
    project_title
    project_description
    isRunning
  }
}
`