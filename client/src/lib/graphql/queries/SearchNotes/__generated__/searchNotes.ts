/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TimerType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: searchNotes
// ====================================================

export interface searchNotes_searchNotes_project {
  __typename: "Project";
  id: string;
  title: string;
  description: string | null;
}

export interface searchNotes_searchNotes {
  __typename: "Timer";
  id: string;
  title: string;
  project: searchNotes_searchNotes_project | null;
  type: TimerType | null;
  notes: string | null;
  start: number;
  end: number | null;
  isRunning: boolean;
}

export interface searchNotes {
  searchNotes: (searchNotes_searchNotes | null)[];
}

export interface searchNotesVariables {
  query: string;
}
