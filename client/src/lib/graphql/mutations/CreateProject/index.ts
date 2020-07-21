import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation createProject($title: String!, $description: String) {
    createProject(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;
