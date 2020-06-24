/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Timers
// ====================================================

export interface Timers_timers {
  __typename: "Timer";
  id: string;
  title: string;
  project_id: string;
  type: string;
  notes: string;
  description: string;
  start: number;
  end: number;
  isRunning: boolean;
}

export interface Timers {
  timers: Timers_timers[];
}
