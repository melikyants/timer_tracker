import { gql } from 'apollo-boost';

export const UPDATE_TIMER = gql`
  mutation updateTimer($id: ID!, $title: String, $project_id: String, $project_description: String, $notes: String, $type: TimerType){
    updateTimer(id: $id, title: $title, project_id: $project_id, project_description: $project_description, notes: $notes, type: $type){
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
`