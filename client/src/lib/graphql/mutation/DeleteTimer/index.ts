import { gql } from 'apollo-boost';

export const DELETE_TIMER = gql`
  mutation deleteTimer($id: ID!){
    deleteTimer(id: $id){
      id
    }
  }
`