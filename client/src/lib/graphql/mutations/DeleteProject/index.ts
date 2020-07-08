import { gql } from 'apollo-boost';

export const DELETE_PROJECT = gql`
  mutation deleteProject($id: ID!){
    deleteProject(id: $id) {
      id
    }
  }
`