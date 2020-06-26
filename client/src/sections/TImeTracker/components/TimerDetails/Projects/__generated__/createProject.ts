/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createProject
// ====================================================

export interface createProject_createProject {
  __typename: "Project";
  id: string;
}

export interface createProject {
  createProject: createProject_createProject;
}

export interface createProjectVariables {
  title: string;
  info?: string | null;
}
