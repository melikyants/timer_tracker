/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AssignProject
// ====================================================

export interface AssignProject_assignProject {
  __typename: "Timer";
  id: string;
}

export interface AssignProject {
  assignProject: AssignProject_assignProject | null;
}

export interface AssignProjectVariables {
  timer_id: string;
  id: string;
}
