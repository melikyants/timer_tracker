import { gql } from "@apollo/client";

export const SEARCH_NOTES = gql`
  query searchNotes($query: String!) {
    searchNotes(query: $query) {
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
