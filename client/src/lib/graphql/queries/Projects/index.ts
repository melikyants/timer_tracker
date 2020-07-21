import { gql } from "@apollo/client";

export const PROJECTS = gql`
  query Projects {
    projects {
      id
      title
      description
    }
  }
`;
