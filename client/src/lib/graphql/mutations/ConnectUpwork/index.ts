import { gql } from "apollo-boost";

export const CONNECT_UPWORK = gql`
  mutation connectUpwork($input: connectUpworkInput) {
    connectUpwork(input: $input) {
      id
      tokenGoogle
      tokenUpwork
      avatar
      didRequest
    }
  }
`;
