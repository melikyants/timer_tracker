import { gql } from 'apollo-boost';

export const START_TIMER = gql`
  mutation startTimer($start: Float!, $title:String!){
    startTimer(start: $start, title: $title){
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