import { gql } from 'apollo-boost';

export const PROJECTS = gql`
  query Projects {
    projects {
      id
      title
      description
    }
  }
`;