import { gql } from 'apollo-boost';

export const CREATE_TIMER = gql`
  mutation createTimer($start: Float!, $title:String!){
    createTimer(start: $start, title: $title){
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