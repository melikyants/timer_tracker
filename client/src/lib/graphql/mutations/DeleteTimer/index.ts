import { gql } from "@apollo/client";

export const DELETE_TIMER = gql`
  mutation deleteTimer($id: ID!) {
    deleteTimer(id: $id) {
      id
    }
  }
`;
