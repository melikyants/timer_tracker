/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { connectUpworkInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: connectUpwork
// ====================================================

export interface connectUpwork_connectUpwork {
  __typename: "Viewer";
  id: string | null;
  tokenGoogle: string | null;
  tokenUpwork: string | null;
  avatar: string | null;
  didRequest: boolean;
}

export interface connectUpwork {
  connectUpwork: connectUpwork_connectUpwork;
}

export interface connectUpworkVariables {
  input?: connectUpworkInput | null;
}
